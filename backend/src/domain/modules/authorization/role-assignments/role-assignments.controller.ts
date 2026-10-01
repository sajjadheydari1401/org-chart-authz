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
  @ApiOperation({
    summary: 'Get a role assignment',
    description: 'Returns one local role assignment by numeric ID.',
  })
  getRoleAssignment(@Param('id', ParseIntPipe) id: number) {
    return this.roleAssignmentsService.getRoleAssignment(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a role assignment',
    description: 'Changes the user or role linked by an assignment.',
  })
  updateRoleAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateRoleAssignmentDto,
  ) {
    return this.roleAssignmentsService.updateRoleAssignment(id, input);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a role assignment',
    description: 'Removes a local user-role assignment by its numeric ID.',
  })
  deleteRoleAssignment(@Param('id', ParseIntPipe) id: number) {
    return this.roleAssignmentsService.deleteRoleAssignment(id);
  }
}
