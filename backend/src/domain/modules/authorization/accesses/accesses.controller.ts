import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../../common/utils/interceptor/format-response.interceptor.js';
import { AccessesService } from './accesses.service.js';
import { CreateAccessDto } from './dto/create-access.dto.js';

@UseInterceptors(FormatResponseInterceptor)
@Controller('accesses')
export class AccessesController {
  constructor(private readonly accessesService: AccessesService) {}

  @Post()
  createAccess(@Body() input: CreateAccessDto) {
    return this.accessesService.createAccess(input);
  }
}
