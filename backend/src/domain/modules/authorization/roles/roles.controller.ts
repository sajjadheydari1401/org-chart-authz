import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../../common/utils/interceptor/format-response.interceptor.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
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
}
