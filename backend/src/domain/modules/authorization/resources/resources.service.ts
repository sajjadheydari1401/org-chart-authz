import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorizationProviderService } from '../authorization-provider.service.js';
import { CreateResourceDto } from './dto/create-resource.dto.js';
import { UpdateResourceDto } from './dto/update-resource.dto.js';
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

  async deleteResource(id: number): Promise<void> {
    const resource = await this.getSingleResource(id);
    await this.authorizationProvider.deleteResource(resource.providerId);

    const result = await this.resources.delete(id);
    if (!result.affected) throw new NotFoundException();
  }

  private async getSingleResource(id: number): Promise<Resource> {
    const resource = await this.resources.findOneBy({ id });
    if (!resource) throw new NotFoundException();
    return resource;
  }

  async updateResource(
    id: number,
    input: UpdateResourceDto,
  ): Promise<Resource> {
    const resource = await this.getSingleResource(id);

    const updatedResource = await this.authorizationProvider.updateResource(
      resource.providerId,
      input.route,
    );

    return this.resources.save({ ...resource, route: updatedResource.route });
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
