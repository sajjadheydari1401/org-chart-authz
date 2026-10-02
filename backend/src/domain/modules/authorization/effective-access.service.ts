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
    const assignments = await this.roleAssignments.find({
      where: { user: { username } },
      relations: { role: { unit: true } },
    });
    if (assignments.length === 0) return [];

    // Load the user's assigned roles and each role's unit/scope.
    // Start with explicitly assigned roles; DESCENDANTS scope also includes roles from child units.
    const roleIds = new Set(assignments.map(({ role }) => role.id));
    const descendantUnitIds = assignments
      .filter(({ role }) => role.scopeMode === RoleScopeMode.DESCENDANTS)
      .map(({ role }) => role.unit.id);

    if (descendantUnitIds.length > 0) {
      // Find child units, then add roles anchored there; assigned roles already cover the starting units.
      const descendants: Array<{ id: string }> = await this.dataSource.query(
        GET_DESCENDANT_UNIT_IDS_QUERY,
        [descendantUnitIds],
      );

      if (descendants.length > 0) {
        const descendantRoles = await this.roles.find({
          where: { unit: { id: In(descendants.map(({ id }) => id)) } },
          select: { id: true },
        });
        for (const role of descendantRoles) roleIds.add(role.id);
      }
    }

    // Preserve the unit that supplied each grant so data queries can enforce scope.
    const roleAccesses = await this.roleAccesses.find({
      where: { roleId: In([...roleIds]) },
      relations: { role: { unit: true }, access: { resource: true } },
    });

    // Return each route/method once while retaining every granting unit.
    const distinctAccesses = new Map<string, EffectiveAccess>();
    for (const { role, access } of roleAccesses) {
      const key = `${access.resource.route}\0${access.methodName}`;
      const effectiveAccess = distinctAccesses.get(key) ?? {
        route: access.resource.route,
        methodName: access.methodName,
        unitIds: [],
      };
      if (!effectiveAccess.unitIds.includes(role.unit.id)) {
        effectiveAccess.unitIds.push(role.unit.id);
      }
      distinctAccesses.set(key, effectiveAccess);
    }

    return [...distinctAccesses.values()];
  }
}
