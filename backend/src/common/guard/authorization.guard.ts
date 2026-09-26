import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadGatewayException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { ProviderError } from '../filter/provider-error.js';
import { AppApi } from '../utils/api/AppApi.js';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<
      Request & {
        userId?: string;
        user?: { token?: string };
      }
    >();
    const token =
      request.user?.token ??
      request.headers.authorization?.match(/^Bearer (.+)$/i)?.[1];
    if (!token) throw new UnauthorizedException();

    const { data } = await AppApi.post(
      `${this.config.getOrThrow<string>('AUTH_SERVICE_URL').replace(/\/+$/, '')}/api/v1/auth/authorization`,
      {
        systemUsername: this.config.getOrThrow<string>('AUTH_SERVICE_USERNAME'),
        systemPassword: this.config.getOrThrow<string>('AUTH_SERVICE_PASSWORD'),
        token,
        route: request.route.path,
        method: request.method,
      },
    );
    if (data?.success === false) throw new ProviderError(data, 403);
    if (data?.success !== true || !data.result?.userId)
      throw new BadGatewayException();
    request.userId = data.result.userId;
    return true;
  }
}
