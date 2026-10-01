import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../../common/utils/interceptor/format-response.interceptor.js';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoleAccessDto } from './dto/create-role-access.dto.js';
import { RoleAccessesService } from './role-accesses.service.js';

@UseInterceptors(FormatResponseInterceptor)
@ApiTags('Role Accesses')
@Controller('role-accesses')
export class RoleAccessesController {
  constructor(private readonly roleAccessesService: RoleAccessesService) {}

  @Get('role-accesses')
  @ApiOperation({
    summary: 'List role-access links',
    description:
      'Returns role-access links with their related roles and accesses.',
  })
  getAllRoleAccesses() {
    return this.roleAccessesService.getAllRoleAccesses();
  }

  @Post('role-accesses')
  @ApiOperation({
    summary: 'Link an access to a role',
    description: 'Creates a provider role-access link and stores it locally.',
  })
  createRoleAccess(@Body() input: CreateRoleAccessDto) {
    return this.roleAccessesService.createRoleAccess(input);
  }

  @Delete(':roleId/accesses/:accessId')
  @ApiOperation({
    summary: 'Unlink an access from a role',
    description:
      'Deletes a role-access link from the provider and local database.',
  })
  deleteRoleAccess(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('accessId', ParseIntPipe) accessId: number,
  ) {
    return this.roleAccessesService.deleteRoleAccess(roleId, accessId);
  }
}
