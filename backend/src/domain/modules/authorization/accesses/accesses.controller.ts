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
import { AccessesService } from './accesses.service.js';
import { CreateAccessDto } from './dto/create-access.dto.js';
import { UpdateAccessDto } from './dto/update-access.dto.js';

@UseInterceptors(FormatResponseInterceptor)
@ApiTags('Accesses')
@Controller('accesses')
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an access',
    description: 'Deletes an access from the provider and local database.',
  })
  deleteAccess(@Param('id', ParseIntPipe) id: number) {
    return this.accessesService.deleteAccess(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an access',
    description:
      'Updates an access method and description in the provider and local database.',
  })
  updateAccess(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateAccessDto,
  ) {
    return this.accessesService.updateAccess(id, input);
  }

  @Get()
  @ApiOperation({
    summary: 'List accesses',
    description: 'Returns accesses stored in the local database.',
  })
  getAllAccesses() {
    return this.accessesService.getAllAccesses();
  }

  @Post()
  @ApiOperation({
    summary: 'Create an access',
    description:
      'Creates a method access for an existing resource in the provider and local database.',
  })
  createAccess(@Body() input: CreateAccessDto) {
    return this.accessesService.createAccess(input);
  }
}
