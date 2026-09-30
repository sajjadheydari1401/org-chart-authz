import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../../common/utils/interceptor/format-response.interceptor.js';
import { CreateRoleAccessDto } from './dto/create-role-access.dto.js';
import { RoleAccessesService } from './role-accesses.service.js';

@UseInterceptors(FormatResponseInterceptor)
@Controller('role-accesses')
export class RoleAccessesController {
  constructor(private readonly roleAccessesService: RoleAccessesService) {}

  @Get('role-accesses')
  getAllRoleAccesses() {
    return this.roleAccessesService.getAllRoleAccesses();
  }

  @Post('role-accesses')
  createRoleAccess(@Body() input: CreateRoleAccessDto) {
    return this.roleAccessesService.createRoleAccess(input);
  }

  @Delete(':roleId/accesses/:accessId')
  deleteRoleAccess(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('accessId', ParseIntPipe) accessId: number,
  ) {
    return this.roleAccessesService.deleteRoleAccess(roleId, accessId);
  }
}
