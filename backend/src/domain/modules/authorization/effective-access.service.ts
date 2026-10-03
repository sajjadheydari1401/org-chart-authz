import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import type { EffectiveAccess } from '../../../types/effective-access.js';
import { User } from '../../users/entities/user.entity.js';
import { Access } from './accesses/entities/access.entity.js';
import { GET_DESCENDANT_UNIT_IDS_QUERY } from './queries/get-descendant-unit-ids.query.js';
import { RoleAssignment } from './role-assignments/entities/role-assignment.entity.js';
import { RoleAccess } from './role-accesses/entities/role-access.entity.js';
import { Role, RoleScopeMode } from './roles/entities/role.entity.js';

@Injectable()
export class EffectiveAccessService {
  constructor(
    @InjectRepository(RoleAssignment)
    private readonly roleAssignments: Repository<RoleAssignment>,
    @InjectRepository(Role)
    private readonly roles: Repository<Role>,
    @InjectRepository(RoleAccess)
    private readonly roleAccesses: Repository<RoleAccess>,
    @InjectRepository(Access)
    private readonly accesses: Repository<Access>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  private async userHasOwnerRole(username: string): Promise<boolean> {
    const user = await this.users.findOne({
      where: { username },
      relations: { providerLoginRole: true },
    });

    if (user?.providerLoginRole?.name?.trim().toLowerCase() === 'owner') {
      return true;
    }

    const assignments = await this.roleAssignments.find({
      where: { user: { username } },
      relations: { role: true },
    });

    return assignments.some(
      ({ role }) => role.name.trim().toLowerCase() === 'owner',
    );
  }

  private async getOwnerAccesses(): Promise<EffectiveAccess[]> {
    const allAccesses = await this.accesses.find({
      relations: { resource: true },
    });

    // Owners bypass unit-based limits, so we build a full access list from every
    // known route/method pair. The UI checks unitIds.length > 0 to decide if a
    // section is visible, so we give the owner a non-empty marker instead of an empty set.
    const distinctAccesses = new Map<string, EffectiveAccess>();
    for (const access of allAccesses) {
      // Route + HTTP method is the unique identity for a permission.
      const key = `${access.resource.route}\0${access.methodName}`;

      // Remove duplicate permissions if the same route + method appears more than once.
      if (!distinctAccesses.has(key)) {
        distinctAccesses.set(key, {
          route: access.resource.route,
          methodName: access.methodName,
          // We do not want to restrict an owner to a specific unit.
          // A non-empty array keeps the frontend visibility checks happy.
          unitIds: ['owner'],
        });
      }
    }

    return [...distinctAccesses.values()];
  }

  /** Resolves route/method accesses granted by the user's assigned roles and their scope. */
  async getEffectiveAccessesForUsername(
    username: string,
  ): Promise<EffectiveAccess[]> {
    if (await this.userHasOwnerRole(username)) {
      return this.getOwnerAccesses();
    }

    // 1) Get all role assignments for this user.
    //    Example: "John has roles in unit A and unit B".
    const assignments = await this.roleAssignments.find({
      where: { user: { username } },
      relations: { role: { unit: true } },
    });

    // 2) If the user has no assignments, they have no access.
    if (assignments.length === 0) return [];

    // 3) Start collecting all role IDs that matter for this user.
    //    First, include the roles already directly assigned to the user.
    const roleIds = new Set(assignments.map(({ role }) => role.id));

    // 4) Check if any assigned roles use DESCENDANTS scope.
    //    That means the user should also get access from child units under that unit.
    const descendantUnitIds = assignments
      .filter(({ role }) => role.scopeMode === RoleScopeMode.DESCENDANTS)
      .map(({ role }) => role.unit.id);

    // 5) If there are descendant-scoped roles, find all child units under them.
    if (descendantUnitIds.length > 0) {
      const descendants: Array<{ id: string }> = await this.dataSource.query(
        GET_DESCENDANT_UNIT_IDS_QUERY,
        [descendantUnitIds],
      );

      // 6) Add all roles attached to those child units into the final role set.
      if (descendants.length > 0) {
        const descendantRoles = await this.roles.find({
          where: { unit: { id: In(descendants.map(({ id }) => id)) } },
          select: { id: true },
        });
        for (const role of descendantRoles) roleIds.add(role.id);
      }
    }

    // 7) Load all access records linked to the user's effective roles.
    //    We also fetch the role and unit info so we know which unit granted each access.
    const roleAccesses = await this.roleAccesses.find({
      where: { roleId: In([...roleIds]) },
      relations: { role: { unit: true }, access: { resource: true } },
    });

    // 8) Merge access results by route + method.
    //    This avoids duplicates when the same permission comes from multiple units or roles.
    const distinctAccesses = new Map<string, EffectiveAccess>();
    for (const { role, access } of roleAccesses) {
      const key = `${access.resource.route}\0${access.methodName}`;
      const effectiveAccess = distinctAccesses.get(key) ?? {
        route: access.resource.route,
        methodName: access.methodName,
        unitIds: [],
      };

      // 9) Keep a list of units that granted this permission.
      if (!effectiveAccess.unitIds.includes(role.unit.id)) {
        effectiveAccess.unitIds.push(role.unit.id);
      }

      distinctAccesses.set(key, effectiveAccess);
    }

    // 10) Return the final deduplicated access list.
    //     Each item says: "this route/method is allowed, and these units grant it."
    return [...distinctAccesses.values()];
  }
}
