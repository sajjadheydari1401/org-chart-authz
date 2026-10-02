import {
  Controller,
  Body,
  Delete,
  Get,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../common/utils/interceptor/format-response.interceptor.js';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';
import { RequireAccess } from '../../../common/decorator/require-access.decorator.js';
import { ListUsersQueryDto } from './dto/list-users-query.dto.js';
import type { Request } from 'express';

type AuthenticatedRequest = Request & { user: { username: string } };

@UseInterceptors(FormatResponseInterceptor)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequireAccess({ route: '/users', methodName: 'GET' })
  @ApiOperation({
    summary: 'List users',
    description: "Returns users assigned to units within the caller's scope.",
  })
  @ApiQuery({ name: 'unitId', required: false, format: 'uuid' })
  getAllUsers(
    @Req() request: AuthenticatedRequest,
    @Query() query: ListUsersQueryDto,
  ) {
    return this.usersService.getAllUsers(request.user.username, query.unitId);
  }

  @Get(':id')
  @RequireAccess({ route: '/users/:id', methodName: 'GET' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'User UUID.',
  })
  @ApiOperation({
    summary: 'Get a user',
    description: 'Returns one local user by UUID.',
  })
  getSingleUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.usersService.getSingleUser(id, request.user.username);
  }

  @Patch(':id')
  @RequireAccess({ route: '/users/:id', methodName: 'PATCH' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'User UUID.',
  })
  @ApiOperation({
    summary: 'Update a username',
    description: 'Changes the username of a local user.',
  })
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateUserDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.usersService.updateUser(id, input, request.user.username);
  }

  @Delete(':id')
  @RequireAccess({ route: '/users/:id', methodName: 'DELETE' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'User UUID.',
  })
  @ApiOperation({
    summary: 'Delete a user',
    description:
      'Deletes the user from the authentication provider and then from the local database.',
  })
  deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.usersService.deleteUser(id, request.user.username);
  }
}
