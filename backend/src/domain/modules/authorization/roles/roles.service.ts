import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Unit } from '../../units/entities/unit.entity.js';
import { Access } from '../accesses/entities/access.entity.js';
import { AuthorizationProviderService } from '../authorization-provider.service.js';
import { CreateRoleAssignmentDto } from './dto/create-role-assignment.dto.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { CreateRoleAccessDto } from './dto/create-role-access.dto.js';
import { UpdateRoleAssignmentDto } from './dto/update-role-assignment.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { RoleAssignment } from './entities/role-assignment.entity.js';
import { RoleAccess } from './entities/role-access.entity.js';
import { Role } from './entities/role.entity.js';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roles: Repository<Role>,
    @InjectRepository(Unit) private readonly units: Repository<Unit>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Access) private readonly accesses: Repository<Access>,
    @InjectRepository(RoleAccess)
    private readonly roleAccesses: Repository<RoleAccess>,
    @InjectRepository(RoleAssignment)
    private readonly roleAssignments: Repository<RoleAssignment>,
    private readonly authorizationProvider: AuthorizationProviderService,
  ) {}

  getAllRoles(): Promise<Role[]> {
    return this.roles.find();
  }

  async createRole(input: CreateRoleDto): Promise<Role> {
    const unit = await this.units.findOneBy({ id: input.unitId });
    if (!unit) throw new NotFoundException();

    const result = await this.authorizationProvider.createRole(
      input.name,
      input.description,
    );
    try {
      return await this.roles.save(
        this.roles.create({
          name: result.name,
          description: result.description,
          providerId: result.id,
          unit,
          scopeMode: input.scopeMode,
        }),
      );
    } catch (error) {
      try {
        await this.authorizationProvider.deleteRole(result.id);
      } catch {
        // TODO: Handle provider cleanup failures.
      }

      throw error;
    }
  }

  async updateRole(id: number, input: UpdateRoleDto): Promise<Role> {
    const role = await this.roles.findOneBy({ id });
    if (!role) throw new NotFoundException();

    const unit = await this.units.findOneBy({ id: input.unitId });
    if (!unit) throw new NotFoundException();

    const result = await this.authorizationProvider.updateRole(
      role.providerId,
      input.name,
      input.description,
    );

    return this.roles.save({
      ...role,
      providerId: result.id,
      name: result.name,
      description: result.description,
      unit,
      scopeMode: input.scopeMode,
    });
  }

  async deleteRole(id: number): Promise<void> {
    const role = await this.roles.findOneBy({ id });
    if (!role) throw new NotFoundException();

    await this.authorizationProvider.deleteRole(role.providerId);

    const result = await this.roles.delete(id);
    if (!result.affected) throw new NotFoundException();
  }

  async createRoleAccess(input: CreateRoleAccessDto): Promise<RoleAccess> {
    const role = await this.roles.findOneBy({ id: input.roleId });
    if (!role) throw new NotFoundException();

    const access = await this.accesses.findOneBy({ id: input.accessId });
    if (!access) throw new NotFoundException();

    const existingRoleAccess = await this.roleAccesses.findOneBy({
      roleId: input.roleId,
      accessId: input.accessId,
    });
    if (existingRoleAccess) throw new ConflictException();

    const result = await this.authorizationProvider.createRoleAccess(
      access.providerId,
      role.providerId,
    );

    try {
      return await this.roleAccesses.save(
        this.roleAccesses.create({
          role,
          access,
          providerId: result.id,
        }),
      );
    } catch (error) {
      try {
        await this.authorizationProvider.deleteRoleAccess(result.id);
      } catch {
        // TODO: Handle provider cleanup failures.
      }

      throw error;
    }
  }

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
      this.roleAssignments.create({
        user,
        role,
      }),
    );
  }

  async updateRoleAssignment(
    id: number,
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

    return this.roleAssignments.save({
      ...assignment,
      user,
      role,
    });
  }

  getAllRoleAccesses(): Promise<RoleAccess[]> {
    return this.roleAccesses.find({
      relations: { role: true, access: true },
    });
  }

  async deleteRoleAccess(roleId: number, accessId: number): Promise<void> {
    const roleAccess = await this.roleAccesses.findOneBy({ roleId, accessId });
    if (!roleAccess) throw new NotFoundException();

    await this.authorizationProvider.deleteRoleAccess(roleAccess.providerId);

    const result = await this.roleAccesses.delete({ roleId, accessId });
    if (!result.affected) throw new NotFoundException();
  }
}
