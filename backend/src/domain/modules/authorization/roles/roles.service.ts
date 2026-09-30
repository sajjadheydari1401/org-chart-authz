import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from '../../units/entities/unit.entity.js';
import { Access } from '../accesses/entities/access.entity.js';
import { AuthorizationProviderService } from '../authorization-provider.service.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { CreateRoleAccessDto } from './dto/create-role-access.dto.js';
import { RoleAccess } from './entities/role-access.entity.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { Role } from './entities/role.entity.js';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roles: Repository<Role>,
    @InjectRepository(Unit) private readonly units: Repository<Unit>,
    @InjectRepository(Access) private readonly accesses: Repository<Access>,
    @InjectRepository(RoleAccess)
    private readonly roleAccesses: Repository<RoleAccess>,
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
    return this.roles.save(
      this.roles.create({
        name: result.name,
        description: result.description,
        providerId: result.id,
        unit,
        scopeMode: input.scopeMode,
      }),
    );
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

    return this.roleAccesses.save(
      this.roleAccesses.create({
        role,
        access,
        providerId: result.id,
      }),
    );
  }
}
