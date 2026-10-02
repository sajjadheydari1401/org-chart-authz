import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { EffectiveAccess } from '../../types/effective-access.js';
import { REQUIRED_ACCESS_METADATA } from '../decorator/require-access.decorator.js';
import { AccessGuard } from './authorization.guard.js';

describe('AccessGuard', () => {
  const handler = vi.fn();
  const controller = vi.fn();
  let requiredAccess: EffectiveAccess | undefined;
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
      { route: '/users', methodName: 'GET' },
    ]);

    await expect(guard.canActivate(createContext())).resolves.toBe(true);
    expect(
      effectiveAccess.getEffectiveAccessesForUsername,
    ).toHaveBeenCalledWith('person');
  });

  it('denies when the user lacks the exact route and method access', async () => {
    effectiveAccess.getEffectiveAccessesForUsername.mockResolvedValue([
      { route: '/users', methodName: 'POST' },
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
});
