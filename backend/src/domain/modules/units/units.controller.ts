import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../common/utils/interceptor/format-response.interceptor.js';
import { CreateUnitDto } from './dto/create-unit.dto.js';
import { UnitsService } from './units.service.js';

@UseInterceptors(FormatResponseInterceptor)
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  createUnit(@Body() input: CreateUnitDto) {
    return this.unitsService.createUnit(input);
  }
}
