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
import { paginatedResponse, pagination } from '../../../common/utils/tools.js';
import type { PaginatedResponse } from '../../../common/types/pagination.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';
import { GET_USERS_IN_UNITS_QUERY } from './queries/get-users-in-units.query.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly authProvider: AuthProviderService,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly effectiveAccess: EffectiveAccessService,
  ) {}

  async getLoginDetails(
    username: string,
  ): Promise<{ roleName: string; isManager: boolean }> {
    const user = await this.users.findOne({
      where: { username },
      relations: { providerLoginRole: true },
    });
    const roleName = user?.providerLoginRole?.name;

    if (!roleName?.trim()) {
      throw new UnauthorizedException();
    }

    return { roleName, isManager: user?.isManager ?? false };
  }

  private async isOwner(username: string): Promise<boolean> {
    const user = await this.users.findOne({
      where: { username },
      relations: { providerLoginRole: true },
    });

    if (user?.providerLoginRole?.name?.trim().toLowerCase() === 'owner') {
      return true;
    }

    const assignmentsRepository =
      this.dataSource?.getRepository?.(RoleAssignment);
    if (!assignmentsRepository) {
      return false;
    }

    const assignments = await assignmentsRepository.find({
      where: { user: { username } },
      relations: { role: true },
    });

    return assignments.some(
      ({ role }) => role.name.trim().toLowerCase() === 'owner',
    );
  }

  async getAllUsers(
    username: string,
    unitId?: string,
    page?: number,
    pageSize?: number,
    isManager?: boolean,
  ): Promise<PaginatedResponse<User>> {
    const isOwner = await this.isOwner(username);
    const query = isOwner
      ? this.users.createQueryBuilder('user')
      : this.buildUsersInUnitsQuery(
          await this.getScopedUnitIds(username, '/users', 'GET', unitId),
        );

    if (isManager !== undefined) {
      query.andWhere('user.isManager = :isManager', { isManager });
    }
    const metadata = pagination(pageSize, page, await query.getCount());
    const items = await query
      .orderBy('user.username', 'ASC')
      .addOrderBy('user.id', 'ASC')
      .skip(metadata.skip)
      .take(metadata.pageSize)
      .getMany();

    return paginatedResponse(items, metadata);
  }

  async getSingleUser(id: string, username: string): Promise<User> {
    return this.findSingleUserInScope(id, username, 'GET');
  }

  // Only return users whose assigned roles belong to an allowed unit.
  private buildUsersInUnitsQuery(unitIds: string[]) {
    return this.users
      .createQueryBuilder('user')
      .where(GET_USERS_IN_UNITS_QUERY, { allowedUnitIds: unitIds });
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

  // Find the user only if they belong to a unit this caller can access.
  private async findSingleUserInScope(
    id: string,
    username: string,
    methodName: 'GET' | 'PATCH' | 'DELETE',
  ): Promise<User> {
    if (await this.isOwner(username)) {
      const user = await this.users.findOneBy({ id });
      if (user) return user;
      throw new NotFoundException();
    }

    const allowedUnitIds = await this.getScopedUnitIds(
      username,
      '/users/:id',
      methodName,
    );
    const user = await this.buildUsersInUnitsQuery(allowedUnitIds)
      .andWhere('user.id = :userId', { userId: id })
      .getOne();
    if (user) return user;

    // Return 404 if the user is missing, or 403 if the caller cannot access them.
    const existingUser = await this.users.findOneBy({ id });
    if (!existingUser) throw new NotFoundException();
    throw new ForbiddenException();
  }

  async updateUser(
    id: string,
    input: UpdateUserDto,
    username: string,
  ): Promise<User> {
    const user = await this.findSingleUserInScope(id, username, 'PATCH');
    const existingUser = await this.users.findOneBy({
      username: input.username,
    });

    if (existingUser && existingUser.id !== user.id) {
      throw new ConflictException();
    }

    const updatedUser = { ...user, ...input };
    return this.users.save(updatedUser);
  }

  async deleteUser(id: string, username: string): Promise<void> {
    const user = await this.findSingleUserInScope(id, username, 'DELETE');
    await this.authProvider.deleteUser(user.username);

    const result = await this.users.delete(id);
    if (!result.affected) throw new NotFoundException();
  }

  async createLocalUserWithRole(input: {
    username: string;
    email: string;
    mobile: string;
    roleId: string;
    isManager?: boolean;
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
          isManager: input.isManager ?? false,
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
