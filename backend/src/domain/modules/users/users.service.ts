import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AuthProviderService } from '../auth/auth-provider.service.js';
import { Role } from '../authorization/roles/entities/role.entity.js';
import { RoleAssignment } from '../authorization/role-assignments/entities/role-assignment.entity.js';
import { EffectiveAccessService } from '../authorization/effective-access.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly authProvider: AuthProviderService,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly effectiveAccess: EffectiveAccessService,
  ) {}

  async getLoginRoleName(username: string): Promise<string> {
    const user = await this.users.findOne({
      where: { username },
      relations: { providerLoginRole: true },
    });
    const roleName = user?.providerLoginRole?.name;

    if (!roleName?.trim()) {
      throw new UnauthorizedException();
    }

    return roleName;
  }

  async getAllUsers(username: string, unitId?: string): Promise<User[]> {
    const allowedUnitIds = await this.getScopedUnitIds(
      username,
      '/users',
      'GET',
      unitId,
    );

    return this.createUsersInUnitsQuery(allowedUnitIds)
      .orderBy('user.username', 'ASC')
      .addOrderBy('user.id', 'ASC')
      .getMany();
  }

  async getSingleUser(id: string, username: string): Promise<User> {
    const allowedUnitIds = await this.getScopedUnitIds(
      username,
      '/users/:id',
      'GET',
    );
    const user = await this.createUsersInUnitsQuery(allowedUnitIds)
      .andWhere('user.id = :userId', { userId: id })
      .getOne();
    if (user) return user;

    const existingUser = await this.users.findOneBy({ id });
    if (!existingUser) throw new NotFoundException();
    throw new ForbiddenException();
  }

  private createUsersInUnitsQuery(unitIds: string[]) {
    return this.users.createQueryBuilder('user').where(
      `EXISTS (
        SELECT 1
        FROM "role_assignments" "assignment"
        INNER JOIN "roles" "assigned_role"
          ON "assigned_role"."id" = "assignment"."role_id"
        WHERE "assignment"."user_id" = "user"."id"
          AND "assigned_role"."unit_id" IN (:...allowedUnitIds)
      )`,
      { allowedUnitIds: unitIds },
    );
  }

  private async getScopedUnitIds(
    username: string,
    route: string,
    methodName: string,
    requestedUnitId?: string,
  ): Promise<string[]> {
    const accesses =
      await this.effectiveAccess.getEffectiveAccessesForUsername(username);
    const access = accesses.find(
      (candidate) =>
        candidate.route === route && candidate.methodName === methodName,
    );
    const unitIds = [...new Set(access?.unitIds ?? [])];

    if (unitIds.length === 0) throw new ForbiddenException();
    if (requestedUnitId && !unitIds.includes(requestedUnitId)) {
      throw new ForbiddenException();
    }

    return requestedUnitId ? [requestedUnitId] : unitIds;
  }

  private async findSingleUser(id: string): Promise<User> {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return user;
  }

  async updateUser(id: string, input: UpdateUserDto): Promise<User> {
    const user = await this.findSingleUser(id);
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
    const user = await this.findSingleUser(id);
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
          providerLoginRole: role,
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
