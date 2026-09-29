import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../../common/utils/interceptor/format-response.interceptor.js';
import { AccessesService } from './accesses.service.js';
import { CreateAccessDto } from './dto/create-access.dto.js';
import { UpdateAccessDto } from './dto/update-access.dto.js';

@UseInterceptors(FormatResponseInterceptor)
@Controller('accesses')
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  @Patch(':id')
  updateAccess(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateAccessDto,
  ) {
    return this.accessesService.updateAccess(id, input);
  }

  @Get()
  getAllAccesses() {
    return this.accessesService.getAllAccesses();
  }

  @Post()
  createAccess(@Body() input: CreateAccessDto) {
    return this.accessesService.createAccess(input);
  }
}
