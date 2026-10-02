import {
  ForbiddenException,
  RequestMethod,
  UnauthorizedException,
} from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AccessRequirement } from '../../types/effective-access.js';
import { AppController } from '../../app.controller.js';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator.js';
import { REQUIRED_ACCESS_METADATA } from '../decorator/require-access.decorator.js';
import { AccessGuard } from './authorization.guard.js';
import { AuthController } from '../../domain/modules/auth/auth.controller.js';
import { AccessesController } from '../../domain/modules/authorization/accesses/accesses.controller.js';
import { ResourcesController } from '../../domain/modules/authorization/resources/resources.controller.js';
import { RoleAccessesController } from '../../domain/modules/authorization/role-accesses/role-accesses.controller.js';
import { RoleAssignmentsController } from '../../domain/modules/authorization/role-assignments/role-assignments.controller.js';
import { RolesController } from '../../domain/modules/authorization/roles/roles.controller.js';
import { UnitsController } from '../../domain/modules/units/units.controller.js';
import { UsersController } from '../../domain/modules/users/users.controller.js';

const routeControllers = [
  AppController,
  AuthController,
  AccessesController,
  ResourcesController,
  RoleAccessesController,
  RoleAssignmentsController,
  RolesController,
  UnitsController,
  UsersController,
];

function normalizeRoutePath(
  ...segments: Array<string | string[] | undefined>
): string {
  const path = segments
    .flatMap((segment) => (Array.isArray(segment) ? segment : [segment ?? '']))
    .flatMap((segment) => segment.split('/'))
    .filter(Boolean)
    .join('/');
  return `/${path}`;
}

describe('AccessGuard', () => {
  const handler = vi.fn();
  const controller = vi.fn();
  let requiredAccess: AccessRequirement | undefined;
  let request: { user?: { username?: string } };
  let effectiveAccess: {
    getEffectiveAccessesForUsername: ReturnType<typeof vi.fn>;
  };
  let guard: AccessGuard;

  beforeEach(() => {
    requiredAccess = { route: '/users', methodName: 'GET' };
    request = { user: { username: 'person' } };
    effectiveAccess = {
      getEffectiveAccessesForUsername: vi.fn().mockResolvedValue([]),
    };
    const reflector = {
      getAllAndOverride: vi.fn((key: string) =>
        key === REQUIRED_ACCESS_METADATA ? requiredAccess : undefined,
      ),
    } as unknown as Reflector;
    guard = new AccessGuard(
      reflector,
      effectiveAccess as unknown as import('../../domain/modules/authorization/effective-access.service.js').EffectiveAccessService,
    );
  });

  function createContext() {
    return {
      getHandler: () => handler,
      getClass: () => controller,
      switchToHttp: () => ({ getRequest: () => request }),
    } as never;
  }

  it('allows a matching effective route and HTTP method', async () => {
    effectiveAccess.getEffectiveAccessesForUsername.mockResolvedValue([
      { route: '/users', methodName: 'GET', unitIds: ['unit-id'] },
    ]);

    await expect(guard.canActivate(createContext())).resolves.toBe(true);
    expect(
      effectiveAccess.getEffectiveAccessesForUsername,
    ).toHaveBeenCalledWith('person');
  });

  it('denies when the user lacks the exact route and method access', async () => {
    effectiveAccess.getEffectiveAccessesForUsername.mockResolvedValue([
      { route: '/users', methodName: 'POST', unitIds: ['unit-id'] },
    ]);

    await expect(guard.canActivate(createContext())).resolves.toBe(false);
  });

  it('fails closed when no access metadata is declared', async () => {
    requiredAccess = undefined;

    await expect(guard.canActivate(createContext())).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('rejects requests without an authenticated username', async () => {
    request = {};

    await expect(guard.canActivate(createContext())).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('declares the matching permission for every non-public HTTP handler', () => {
    for (const controller of routeControllers) {
      const classIsPublic =
        Reflect.getMetadata(IS_PUBLIC_KEY, controller) === true;
      const controllerPath = Reflect.getMetadata(PATH_METADATA, controller) as
        string | string[] | undefined;

      for (const handlerName of Object.getOwnPropertyNames(
        controller.prototype,
      )) {
        const handler: unknown = Reflect.get(controller.prototype, handlerName);
        if (
          typeof handler !== 'function' ||
          Reflect.getMetadata(METHOD_METADATA, handler) === undefined
        ) {
          continue;
        }

        const isPublic =
          classIsPublic || Reflect.getMetadata(IS_PUBLIC_KEY, handler) === true;
        if (isPublic) continue;

        const requiredAccess = Reflect.getMetadata(
          REQUIRED_ACCESS_METADATA,
          handler,
        ) as AccessRequirement | undefined;
        const handlerPath = Reflect.getMetadata(PATH_METADATA, handler) as
          string | string[] | undefined;
        const requestMethod = Reflect.getMetadata(
          METHOD_METADATA,
          handler,
        ) as RequestMethod;
        const label = `${controller.name}.${handlerName}`;

        expect(requiredAccess, label).toBeDefined();
        expect(requiredAccess?.route, label).toBe(
          normalizeRoutePath(controllerPath, handlerPath),
        );
        expect(requiredAccess?.methodName, label).toBe(
          RequestMethod[requestMethod].toUpperCase(),
        );
      }
    }
  });
});
