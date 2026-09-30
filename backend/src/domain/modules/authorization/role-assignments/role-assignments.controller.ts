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
import { UpdateRoleAssignmentDto } from './dto/update-role-assignment.dto.js';
import { RoleAssignmentsService } from './role-assignments.service.js';

@UseInterceptors(FormatResponseInterceptor)
@Controller('role-assignments')
export class RoleAssignmentsController {
  constructor(
    private readonly roleAssignmentsService: RoleAssignmentsService,
  ) {}

  @Post()
  createRoleAssignment(@Body() input: CreateRoleAssignmentDto) {
    return this.roleAssignmentsService.createRoleAssignment(input);
  }

  @Get()
  getAllRoleAssignments() {
    return this.roleAssignmentsService.getAllRoleAssignments();
  }

  @Get(':id')
  getRoleAssignment(@Param('id', ParseIntPipe) id: number) {
    return this.roleAssignmentsService.getRoleAssignment(id);
  }

  @Patch(':id')
  updateRoleAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateRoleAssignmentDto,
  ) {
    return this.roleAssignmentsService.updateRoleAssignment(id, input);
  }

  @Delete(':id')
  deleteRoleAssignment(@Param('id', ParseIntPipe) id: number) {
    return this.roleAssignmentsService.deleteRoleAssignment(id);
  }
}
