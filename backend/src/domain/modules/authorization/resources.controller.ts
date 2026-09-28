import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../common/utils/interceptor/format-response.interceptor.js';
import { CreateResourceDto } from './dto/create-resource.dto.js';
import { ResourcesService } from './resources.service.js';

@UseInterceptors(FormatResponseInterceptor)
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  createResource(@Body() input: CreateResourceDto) {
    return this.resourcesService.createResource(input);
  }
}
