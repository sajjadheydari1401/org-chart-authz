import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../common/utils/interceptor/format-response.interceptor.js';
import { CreateUnitDto } from './dto/create-unit.dto.js';
import { UpdateUnitDto } from './dto/update-unit.dto.js';
import { UnitsService } from './units.service.js';

@UseInterceptors(FormatResponseInterceptor)
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  createUnit(@Body() input: CreateUnitDto) {
    return this.unitsService.createUnit(input);
  }

  @Patch(':id')
  updateUnit(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateUnitDto,
  ) {
    return this.unitsService.updateUnit(id, input);
  }
}
