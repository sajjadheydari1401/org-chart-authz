import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AuthProviderService } from '../auth/auth-provider.service.js';
import { Role } from '../authorization/roles/entities/role.entity.js';
import { RoleAssignment } from '../authorization/role-assignments/entities/role-assignment.entity.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly authProvider: AuthProviderService,
    @InjectDataSource() private readonly dataSource: DataSource,
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

  async createLocalUserWithRole(input: {
    username: string;
    email: string;
    mobile: string;
    roleId: string;
  }): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const users = manager.getRepository(User);
      const existingUser = await users.findOneBy({ username: input.username });
      if (existingUser) throw new ConflictException();

      const role = await manager
        .getRepository(Role)
        .findOneBy({ id: input.roleId });
      if (!role) throw new NotFoundException();

      const user = await users.save(
        users.create({
          username: input.username,
          email: input.email,
          mobile: input.mobile,
        }),
      );
      const roleAssignments = manager.getRepository(RoleAssignment);
      await roleAssignments.save(
        roleAssignments.create({
          user: { id: user.id },
          role: { id: role.id },
        }),
      );

      return user;
    });
  }
}
