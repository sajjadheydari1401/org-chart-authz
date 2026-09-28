import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorizationProviderService } from '../authorization-provider.service.js';
import { ResourcesService } from '../resources/resources.service.js';
import { CreateAccessDto } from './dto/create-access.dto.js';
import { Access } from './entities/access.entity.js';

@Injectable()
export class AccessesService {
  constructor(
    @InjectRepository(Access) private readonly accesses: Repository<Access>,
    private readonly resourcesService: ResourcesService,
    private readonly authorizationProvider: AuthorizationProviderService,
  ) {}

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
