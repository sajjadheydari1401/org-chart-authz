import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import type { EffectiveAccess } from '../../../types/effective-access.js';
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
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  /** Resolves route/method accesses granted by the user's assigned roles and their scope. */
  async getEffectiveAccessesForUsername(
    username: string,
  ): Promise<EffectiveAccess[]> {
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
