import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../../common/utils/interceptor/format-response.interceptor.js';
import { CreateResourceDto } from './dto/create-resource.dto.js';
import { UpdateResourceDto } from './dto/update-resource.dto.js';
import { ResourcesService } from './resources.service.js';

@UseInterceptors(FormatResponseInterceptor)
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Delete(':id')
  deleteResource(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.deleteResource(id);
  }

  @Get()
  getAllResources() {
    return this.resourcesService.getAllResources();
  }

  @Post()
  createResource(@Body() input: CreateResourceDto) {
    return this.resourcesService.createResource(input);
  }

  @Patch(':id')
  updateResource(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateResourceDto,
  ) {
    return this.resourcesService.updateResource(id, input);
  }
}
