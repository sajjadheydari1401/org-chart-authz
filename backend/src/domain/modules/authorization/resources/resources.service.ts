import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorizationProviderService } from '../authorization-provider.service.js';
import { CreateResourceDto } from './dto/create-resource.dto.js';
import { Resource } from './entities/resource.entity.js';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resources: Repository<Resource>,
    private readonly authorizationProvider: AuthorizationProviderService,
  ) {}

  getAllResources(): Promise<Resource[]> {
    return this.resources.find();
  }

  async createResource(input: CreateResourceDto): Promise<Resource> {
    const providerResource = await this.authorizationProvider.createResource(
      input.route,
    );

    return this.resources.save(
      this.resources.create({
        route: input.route,
        providerId: providerResource.id,
      }),
    );
  }
}
