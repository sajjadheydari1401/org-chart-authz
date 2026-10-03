import type { Role } from './role';

export interface CreateRoleInput {
  name: string;
  farsiName: string;
  description: string;
  unitId: string;
  scopeMode: Role['scopeMode'];
}

export interface AccessRecord {
  id: string;
  methodName: string;
  description: string;
}

export interface RoleAccessRecord {
  roleId: string;
  accessId: string;
  role: Pick<Role, 'id' | 'name' | 'farsiName'>;
  access: AccessRecord;
}

export interface CreateRoleAccessInput {
  roleId: string;
  accessId: string;
}

export interface RoleAssignmentRecord {
  id: string;
  user: { id: string; username: string; isManager: boolean };
  role: Pick<Role, 'id' | 'name' | 'farsiName' | 'unit_id'>;
}

export interface CreateRoleAssignmentInput {
  userId: string;
  roleId: string;
}
