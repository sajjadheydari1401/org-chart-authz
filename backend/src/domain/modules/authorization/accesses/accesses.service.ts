import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorizationProviderService } from '../authorization-provider.service.js';
import { ResourcesService } from '../resources/resources.service.js';
import { CreateAccessDto } from './dto/create-access.dto.js';
import { UpdateAccessDto } from './dto/update-access.dto.js';
import { Access } from './entities/access.entity.js';

@Injectable()
export class AccessesService {
  constructor(
    @InjectRepository(Access) private readonly accesses: Repository<Access>,
    private readonly resourcesService: ResourcesService,
    private readonly authorizationProvider: AuthorizationProviderService,
  ) {}

  getAllAccesses(): Promise<Access[]> {
    return this.accesses.find();
  }

  private async getSingleAccess(id: number): Promise<Access> {
    const access = await this.accesses.findOneBy({ id });
    if (!access) throw new NotFoundException();
    return access;
  }

  async deleteAccess(id: number): Promise<void> {
    const access = await this.getSingleAccess(id);
    await this.authorizationProvider.deleteAccess(access.providerId);

    const result = await this.accesses.delete(id);
    if (!result.affected) throw new NotFoundException();
  }

  async updateAccess(id: number, input: UpdateAccessDto): Promise<Access> {
    const access = await this.getSingleAccess(id);

    const result = await this.authorizationProvider.updateAccess(
      access.providerId,
      input.methodName,
      input.description,
    );
    return this.accesses.save({
      ...access,
      methodName: result.methodName,
      description: result.description,
    });
  }

  async createAccess(input: CreateAccessDto): Promise<Access> {
    const resource = await this.resourcesService.getSingleResource(
      input.resourceId,
    );
    const result = await this.authorizationProvider.createAccess(
      resource.providerId,
      input.methodName,
      input.description,
    );

    return this.accesses.save(
      this.accesses.create({
        methodName: result.methodName,
        description: result.description,
        resource,
        providerId: result.id,
      }),
    );
  }
}
