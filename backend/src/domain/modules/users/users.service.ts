import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthProviderService } from '../auth/auth-provider.service.js';
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

  async getSingleUser(id: number): Promise<User> {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return user;
  }

  async createLocalUser(username: string): Promise<void> {
    const existingUser = await this.users.findOneBy({ username });

    if (existingUser) return;

    await this.users.save(this.users.create({ username }));
  }
}
