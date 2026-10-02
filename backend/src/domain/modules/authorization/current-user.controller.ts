import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthenticatedOnly } from '../../../common/decorator/authenticated-only.decorator.js';
import { FormatResponseInterceptor } from '../../../common/utils/interceptor/format-response.interceptor.js';
import { EffectiveAccessService } from './effective-access.service.js';

type AuthenticatedRequest = Request & { user: { username: string } };

@UseInterceptors(FormatResponseInterceptor)
@ApiTags('Current User')
@Controller('me')
export class CurrentUserController {
  constructor(private readonly effectiveAccess: EffectiveAccessService) {}

  @Get('accesses')
  @AuthenticatedOnly()
  @ApiOperation({
    summary: 'Get the current user’s effective accesses',
    description:
      'Returns route, method, and unit grants for the authenticated user.',
  })
  getEffectiveAccesses(@Req() request: AuthenticatedRequest) {
    return this.effectiveAccess.getEffectiveAccessesForUsername(
      request.user.username,
    );
  }
}
