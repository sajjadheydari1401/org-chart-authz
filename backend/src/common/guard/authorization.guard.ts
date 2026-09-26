import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadGatewayException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ProviderError } from '../filter/provider-error.js';
import { AppApi } from '../utils/api/AppApi.js';

@Injectable()
export class AccessGuard implements CanActivate {
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
      `${process.env.AUTH_SERVICE_URL}/api/v1/auth/authorization`,
      {
        systemUsername: process.env.AUTH_SERVICE_USERNAME,
        systemPassword: process.env.AUTH_SERVICE_PASSWORD,
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
