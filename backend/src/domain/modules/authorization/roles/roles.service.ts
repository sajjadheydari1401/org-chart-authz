import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from '../../units/entities/unit.entity.js';
import { AuthorizationProviderService } from '../authorization-provider.service.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { Role } from './entities/role.entity.js';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roles: Repository<Role>,
    @InjectRepository(Unit) private readonly units: Repository<Unit>,
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
}
