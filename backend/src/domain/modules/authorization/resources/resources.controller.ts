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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateResourceDto } from './dto/create-resource.dto.js';
import { UpdateResourceDto } from './dto/update-resource.dto.js';
import { ResourcesService } from './resources.service.js';

@UseInterceptors(FormatResponseInterceptor)
@ApiTags('Resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a resource',
    description: 'Deletes the resource from the provider and local database.',
  })
  deleteResource(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.deleteResource(id);
  }

  @Get()
  @ApiOperation({
    summary: 'List resources',
    description: 'Returns resources stored in the local database.',
  })
  getAllResources() {
    return this.resourcesService.getAllResources();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a resource',
    description: 'Creates a route resource in the provider and local database.',
  })
  createResource(@Body() input: CreateResourceDto) {
    return this.resourcesService.createResource(input);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a resource route',
    description: 'Updates the route in the provider and local database.',
  })
  updateResource(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateResourceDto,
  ) {
    return this.resourcesService.updateResource(id, input);
  }
}
