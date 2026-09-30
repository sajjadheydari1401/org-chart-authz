import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../../common/utils/interceptor/format-response.interceptor.js';
import { CreateRoleAssignmentDto } from './dto/create-role-assignment.dto.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { CreateRoleAccessDto } from './dto/create-role-access.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { RolesService } from './roles.service.js';

@UseInterceptors(FormatResponseInterceptor)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  getAllRoles() {
    return this.rolesService.getAllRoles();
  }

  @Post()
  createRole(@Body() input: CreateRoleDto) {
    return this.rolesService.createRole(input);
  }

  @Patch(':id')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateRoleDto,
  ) {
    return this.rolesService.updateRole(id, input);
  }

  @Delete(':id')
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.deleteRole(id);
  }

  @Get('role-accesses')
  getAllRoleAccesses() {
    return this.rolesService.getAllRoleAccesses();
  }

  @Post('role-accesses')
  createRoleAccess(@Body() input: CreateRoleAccessDto) {
    return this.rolesService.createRoleAccess(input);
  }

  @Post('role-assignments')
  createRoleAssignment(@Body() input: CreateRoleAssignmentDto) {
    return this.rolesService.createRoleAssignment(input);
  }

  @Delete(':roleId/accesses/:accessId')
  deleteRoleAccess(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('accessId', ParseIntPipe) accessId: number,
  ) {
    return this.rolesService.deleteRoleAccess(roleId, accessId);
  }
}
