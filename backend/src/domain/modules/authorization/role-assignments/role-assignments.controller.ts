import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../../common/utils/interceptor/format-response.interceptor.js';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateRoleAssignmentDto } from './dto/create-role-assignment.dto.js';
import { UpdateRoleAssignmentDto } from './dto/update-role-assignment.dto.js';
import { RoleAssignmentsService } from './role-assignments.service.js';

@UseInterceptors(FormatResponseInterceptor)
@ApiTags('Role Assignments')
@Controller('role-assignments')
export class RoleAssignmentsController {
  constructor(
    private readonly roleAssignmentsService: RoleAssignmentsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Assign a role to a user',
    description:
      'Creates a local assignment between an existing user and role.',
  })
  createRoleAssignment(@Body() input: CreateRoleAssignmentDto) {
    return this.roleAssignmentsService.createRoleAssignment(input);
  }

  @Get()
  @ApiOperation({
    summary: 'List role assignments',
    description: 'Returns local role assignments with their users and roles.',
  })
  getAllRoleAssignments() {
    return this.roleAssignmentsService.getAllRoleAssignments();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Role assignment UUID.',
  })
  @ApiOperation({
    summary: 'Get a role assignment',
    description: 'Returns one local role assignment by UUID.',
  })
  getRoleAssignment(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleAssignmentsService.getRoleAssignment(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Role assignment UUID.',
  })
  @ApiOperation({
    summary: 'Update a role assignment',
    description: 'Changes the user or role linked by an assignment.',
  })
  updateRoleAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateRoleAssignmentDto,
  ) {
    return this.roleAssignmentsService.updateRoleAssignment(id, input);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Role assignment UUID.',
  })
  @ApiOperation({
    summary: 'Delete a role assignment',
    description: 'Removes a local user-role assignment by its UUID.',
  })
  deleteRoleAssignment(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleAssignmentsService.deleteRoleAssignment(id);
  }
}
