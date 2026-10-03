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
import { AccessesService } from './accesses.service.js';
import { CreateAccessDto } from './dto/create-access.dto.js';
import { UpdateAccessDto } from './dto/update-access.dto.js';
import { RequireAccess } from '../../../../common/decorator/require-access.decorator.js';

@UseInterceptors(FormatResponseInterceptor)
@ApiTags('Accesses')
@ApiBearerAuth('bearer')
@Controller('accesses')
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  @Delete(':id')
  @RequireAccess({
    route: '/accesses/:id',
    methodName: 'DELETE',
    allowOwner: true,
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Access UUID.',
  })
  @ApiOperation({
    summary: 'Delete an access',
    description: 'Deletes an access from the provider and local database.',
  })
  deleteAccess(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessesService.deleteAccess(id);
  }

  @Patch(':id')
  @RequireAccess({
    route: '/accesses/:id',
    methodName: 'PATCH',
    allowOwner: true,
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Access UUID.',
  })
  @ApiOperation({
    summary: 'Update an access',
    description:
      'Updates an access method and description in the provider and local database.',
  })
  updateAccess(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateAccessDto,
  ) {
    return this.accessesService.updateAccess(id, input);
  }

  @Get()
  @RequireAccess({ route: '/accesses', methodName: 'GET', allowOwner: true })
  @ApiOperation({
    summary: 'List accesses',
    description: 'Returns accesses stored in the local database.',
  })
  getAllAccesses() {
    return this.accessesService.getAllAccesses();
  }

  @Post()
  @RequireAccess({ route: '/accesses', methodName: 'POST', allowOwner: true })
  @ApiOperation({
    summary: 'Create an access',
    description:
      'Creates a method access for an existing resource in the provider and local database.',
  })
  createAccess(@Body() input: CreateAccessDto) {
    return this.accessesService.createAccess(input);
  }
}
