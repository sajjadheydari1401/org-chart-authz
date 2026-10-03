import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../../common/utils/interceptor/format-response.interceptor.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateResourceDto } from './dto/create-resource.dto.js';
import { UpdateResourceDto } from './dto/update-resource.dto.js';
import { ResourcesService } from './resources.service.js';
import { RequireAccess } from '../../../../common/decorator/require-access.decorator.js';

@UseInterceptors(FormatResponseInterceptor)
@ApiTags('Resources')
@ApiBearerAuth('bearer')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Delete(':id')
  @RequireAccess({ route: '/resources/:id', methodName: 'DELETE' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Resource UUID.',
  })
  @ApiOperation({
    summary: 'Delete a resource',
    description: 'Deletes the resource from the provider and local database.',
  })
  deleteResource(@Param('id', ParseUUIDPipe) id: string) {
    return this.resourcesService.deleteResource(id);
  }

  @Get()
  @RequireAccess({ route: '/resources', methodName: 'GET' })
  @ApiOperation({
    summary: 'List resources',
    description: 'Returns resources stored in the local database.',
  })
  getAllResources() {
    return this.resourcesService.getAllResources();
  }

  @Post()
  @RequireAccess({ route: '/resources', methodName: 'POST' })
  @ApiOperation({
    summary: 'Create a resource',
    description: 'Creates a route resource in the provider and local database.',
  })
  createResource(@Body() input: CreateResourceDto) {
    return this.resourcesService.createResource(input);
  }

  @Patch(':id')
  @RequireAccess({ route: '/resources/:id', methodName: 'PATCH' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Resource UUID.',
  })
  @ApiOperation({
    summary: 'Update a resource route',
    description: 'Updates the route in the provider and local database.',
  })
  updateResource(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateResourceDto,
  ) {
    return this.resourcesService.updateResource(id, input);
  }
}
