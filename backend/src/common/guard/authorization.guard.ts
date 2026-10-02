import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { EffectiveAccess } from '../../types/effective-access.js';
import { EffectiveAccessService } from '../../domain/modules/authorization/effective-access.service.js';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator.js';
import { REQUIRED_ACCESS_METADATA } from '../decorator/require-access.decorator.js';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly effectiveAccess: EffectiveAccessService,
  ) {}

  /** Enforces the exact route/method grant declared with @RequireAccess. */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredAccess = this.reflector.getAllAndOverride<EffectiveAccess>(
      REQUIRED_ACCESS_METADATA,
      [context.getHandler(), context.getClass()],
    );
    // A guarded handler without permission metadata must fail closed.
    if (!requiredAccess) throw new ForbiddenException();

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: { username?: string } }>();
    const username = request.user?.username;
    if (!username?.trim()) throw new UnauthorizedException();

    const accesses =
      await this.effectiveAccess.getEffectiveAccessesForUsername(username);
    return accesses.some(
      (access) =>
        access.route === requiredAccess.route &&
        access.methodName === requiredAccess.methodName,
    );
  }
}
