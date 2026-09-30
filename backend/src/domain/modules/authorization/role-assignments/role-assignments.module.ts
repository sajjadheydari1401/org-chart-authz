import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Role } from '../roles/entities/role.entity.js';
import { RoleAssignment } from './entities/role-assignment.entity.js';
import { RoleAssignmentsController } from './role-assignments.controller.js';
import { RoleAssignmentsService } from './role-assignments.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([RoleAssignment, User, Role])],
  controllers: [RoleAssignmentsController],
  providers: [RoleAssignmentsService],
  exports: [RoleAssignmentsService],
})
export class RoleAssignmentsModule {}
