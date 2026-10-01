import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Role } from '../roles/entities/role.entity.js';
import { CreateRoleAssignmentDto } from './dto/create-role-assignment.dto.js';
import { UpdateRoleAssignmentDto } from './dto/update-role-assignment.dto.js';
import { RoleAssignment } from './entities/role-assignment.entity.js';

@Injectable()
export class RoleAssignmentsService {
  constructor(
    @InjectRepository(RoleAssignment)
    private readonly roleAssignments: Repository<RoleAssignment>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Role)
    private readonly roles: Repository<Role>,
  ) {}

  async createRoleAssignment(
    input: CreateRoleAssignmentDto,
  ): Promise<RoleAssignment> {
    const user = await this.users.findOneBy({ id: input.userId });
    if (!user) throw new NotFoundException();

    const role = await this.roles.findOneBy({ id: input.roleId });
    if (!role) throw new NotFoundException();

    const existingAssignment = await this.roleAssignments.findOne({
      where: { user: { id: input.userId }, role: { id: input.roleId } },
      relations: { user: true, role: true },
    });
    if (existingAssignment) throw new ConflictException();

    return this.roleAssignments.save(
      this.roleAssignments.create({ user, role }),
    );
  }

  getAllRoleAssignments(): Promise<RoleAssignment[]> {
    return this.roleAssignments.find({
      relations: { user: true, role: true },
    });
  }

  async getRoleAssignment(id: string): Promise<RoleAssignment> {
    const assignment = await this.roleAssignments.findOne({
      where: { id },
      relations: { user: true, role: true },
    });
    if (!assignment) throw new NotFoundException();
    return assignment;
  }

  async updateRoleAssignment(
    id: string,
    input: UpdateRoleAssignmentDto,
  ): Promise<RoleAssignment> {
    const assignment = await this.roleAssignments.findOneBy({ id });
    if (!assignment) throw new NotFoundException();

    const user = await this.users.findOneBy({ id: input.userId });
    if (!user) throw new NotFoundException();

    const role = await this.roles.findOneBy({ id: input.roleId });
    if (!role) throw new NotFoundException();

    const existingAssignment = await this.roleAssignments.findOne({
      where: { user: { id: input.userId }, role: { id: input.roleId } },
    });
    if (existingAssignment && existingAssignment.id !== id) {
      throw new ConflictException();
    }

    return this.roleAssignments.save({ ...assignment, user, role });
  }

  async deleteRoleAssignment(id: string): Promise<void> {
    const result = await this.roleAssignments.delete(id);
    if (!result.affected) throw new NotFoundException();
  }
}
