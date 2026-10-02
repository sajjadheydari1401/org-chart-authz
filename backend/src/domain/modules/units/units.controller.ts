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
import { FormatResponseInterceptor } from '../../../common/utils/interceptor/format-response.interceptor.js';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUnitDto } from './dto/create-unit.dto.js';
import { UpdateUnitDto } from './dto/update-unit.dto.js';
import { UnitsService } from './units.service.js';
import { RequireAccess } from '../../../common/decorator/require-access.decorator.js';

@UseInterceptors(FormatResponseInterceptor)
@ApiTags('Organizational Units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @RequireAccess({ route: '/units', methodName: 'GET' })
  @ApiOperation({
    summary: 'List organizational units',
    description: 'Returns all units from the local hierarchy.',
  })
  getAllUnits() {
    return this.unitsService.getAllUnits();
  }

  @Get(':id')
  @RequireAccess({ route: '/units/:id', methodName: 'GET' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Unit UUID.',
  })
  @ApiOperation({
    summary: 'Get an organizational unit',
    description: 'Returns one unit by UUID.',
  })
  getSingleUnit(@Param('id', ParseUUIDPipe) id: string) {
    return this.unitsService.getSingleUnit(id);
  }

  @Post()
  @RequireAccess({ route: '/units', methodName: 'POST' })
  @ApiOperation({
    summary: 'Create an organizational unit',
    description: 'Creates a unit, optionally under an existing parent unit.',
  })
  createUnit(@Body() input: CreateUnitDto) {
    return this.unitsService.createUnit(input);
  }

  @Patch(':id')
  @RequireAccess({ route: '/units/:id', methodName: 'PATCH' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Unit UUID.',
  })
  @ApiOperation({
    summary: 'Update an organizational unit',
    description: 'Updates a unit name, type, or parent.',
  })
  updateUnit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateUnitDto,
  ) {
    return this.unitsService.updateUnit(id, input);
  }

  @Delete(':id')
  @RequireAccess({ route: '/units/:id', methodName: 'DELETE' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'Unit UUID.',
  })
  @ApiOperation({
    summary: 'Delete an organizational unit subtree',
    description:
      'Deletes the selected unit and all descendants. The root unit cannot be deleted.',
  })
  deleteUnit(@Param('id', ParseUUIDPipe) id: string) {
    return this.unitsService.deleteUnit(id);
  }
}
