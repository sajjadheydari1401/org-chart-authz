import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../../common/utils/interceptor/format-response.interceptor.js';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateRoleAccessDto } from './dto/create-role-access.dto.js';
import { RoleAccessesService } from './role-accesses.service.js';
import { RequireAccess } from '../../../../common/decorator/require-access.decorator.js';

@UseInterceptors(FormatResponseInterceptor)
@ApiTags('Role Accesses')
@Controller('role-accesses')
export class RoleAccessesController {
  constructor(private readonly roleAccessesService: RoleAccessesService) {}

  @Get('role-accesses')
  @RequireAccess({ route: '/role-accesses/role-accesses', methodName: 'GET' })
  @ApiOperation({
    summary: 'List role-access links',
    description:
      'Returns role-access links with their related roles and accesses.',
  })
  getAllRoleAccesses() {
    return this.roleAccessesService.getAllRoleAccesses();
  }

  @Post('role-accesses')
  @RequireAccess({ route: '/role-accesses/role-accesses', methodName: 'POST' })
  @ApiOperation({
    summary: 'Link an access to a role',
    description: 'Creates a provider role-access link and stores it locally.',
  })
  createRoleAccess(@Body() input: CreateRoleAccessDto) {
    return this.roleAccessesService.createRoleAccess(input);
  }

  @Delete(':roleId/accesses/:accessId')
  @RequireAccess({
    route: '/role-accesses/:roleId/accesses/:accessId',
    methodName: 'DELETE',
  })
  @ApiParam({
    name: 'roleId',
    type: String,
    format: 'uuid',
    description: 'Role UUID.',
  })
  @ApiParam({
    name: 'accessId',
    type: String,
    format: 'uuid',
    description: 'Access UUID.',
  })
  @ApiOperation({
    summary: 'Unlink an access from a role',
    description:
      'Deletes a role-access link from the provider and local database.',
  })
  deleteRoleAccess(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('accessId', ParseUUIDPipe) accessId: string,
  ) {
    return this.roleAccessesService.deleteRoleAccess(roleId, accessId);
  }
}
