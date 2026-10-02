import {
  Controller,
  Body,
  Delete,
  Get,
  Patch,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../common/utils/interceptor/format-response.interceptor.js';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';
import { RequireAccess } from '../../../common/decorator/require-access.decorator.js';

@UseInterceptors(FormatResponseInterceptor)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequireAccess({ route: '/users', methodName: 'GET' })
  @ApiOperation({
    summary: 'List users',
    description: 'Returns all users stored in the local database.',
  })
  getAllUsers() {
    return this.usersService.getAllUsers();
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
  getSingleUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getSingleUser(id);
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
  ) {
    return this.usersService.updateUser(id, input);
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
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
