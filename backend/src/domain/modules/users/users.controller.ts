import {
  Controller,
  Body,
  Delete,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { FormatResponseInterceptor } from '../../../common/utils/interceptor/format-response.interceptor.js';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';

@UseInterceptors(FormatResponseInterceptor)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'List users',
    description: 'Returns all users stored in the local database.',
  })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user',
    description: 'Returns one local user by numeric ID.',
  })
  getSingleUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getSingleUser(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a username',
    description: 'Changes the username of a local user.',
  })
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, input);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user',
    description:
      'Deletes the user from the authentication provider and then from the local database.',
  })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
