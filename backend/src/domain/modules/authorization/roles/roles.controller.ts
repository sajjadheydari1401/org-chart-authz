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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { RolesService } from './roles.service.js';

@UseInterceptors(FormatResponseInterceptor)
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({
    summary: 'List roles',
    description: 'Returns roles stored in the local database.',
  })
  getAllRoles() {
    return this.rolesService.getAllRoles();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a role',
    description: 'Creates a role in the provider and stores its local scope.',
  })
  createRole(@Body() input: CreateRoleDto) {
    return this.rolesService.createRole(input);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a role',
    description: 'Updates a role in the provider and its local unit scope.',
  })
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateRoleDto,
  ) {
    return this.rolesService.updateRole(id, input);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a role',
    description: 'Deletes a role from the provider and local database.',
  })
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.deleteRole(id);
  }
}
