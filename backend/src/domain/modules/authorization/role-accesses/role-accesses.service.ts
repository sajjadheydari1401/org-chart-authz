import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Access } from '../accesses/entities/access.entity.js';
import { AuthorizationProviderService } from '../authorization-provider.service.js';
import { Role } from '../roles/entities/role.entity.js';
import { CreateRoleAccessDto } from './dto/create-role-access.dto.js';
import { RoleAccess } from './entities/role-access.entity.js';

@Injectable()
export class RoleAccessesService {
  constructor(
    @InjectRepository(RoleAccess)
    private readonly roleAccesses: Repository<RoleAccess>,
    @InjectRepository(Role)
    private readonly roles: Repository<Role>,
    @InjectRepository(Access)
    private readonly accesses: Repository<Access>,
    private readonly authorizationProvider: AuthorizationProviderService,
  ) {}

  getAllRoleAccesses(): Promise<RoleAccess[]> {
    return this.roleAccesses.find({
      relations: { role: true, access: true },
    });
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
        this.roleAccesses.create({ role, access, providerId: result.id }),
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

  async deleteRoleAccess(roleId: string, accessId: string): Promise<void> {
    const roleAccess = await this.roleAccesses.findOneBy({ roleId, accessId });
    if (!roleAccess) throw new NotFoundException();

    await this.authorizationProvider.deleteRoleAccess(roleAccess.providerId);

    const result = await this.roleAccesses.delete({ roleId, accessId });
    if (!result.affected) throw new NotFoundException();
  }
}
