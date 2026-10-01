import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthProviderService } from '../auth/auth-provider.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly authProvider: AuthProviderService,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.users.find();
  }

  async getSingleUser(id: string): Promise<User> {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return user;
  }

  async updateUser(id: string, input: UpdateUserDto): Promise<User> {
    const user = await this.getSingleUser(id);
    const existingUser = await this.users.findOneBy({
      username: input.username,
    });

    if (existingUser && existingUser.id !== user.id) {
      throw new ConflictException();
    }

    const updatedUser = { ...user, ...input };
    return this.users.save(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getSingleUser(id);
    await this.authProvider.deleteUser(user.username);

    const result = await this.users.delete(id);
    if (!result.affected) throw new NotFoundException();
  }

  async createLocalUser(username: string): Promise<void> {
    const existingUser = await this.users.findOneBy({ username });

    if (existingUser) return;

    await this.users.save(this.users.create({ username }));
  }
}
