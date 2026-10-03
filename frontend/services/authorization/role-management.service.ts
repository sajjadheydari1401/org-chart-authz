import { AppApi } from '@/lib/api/client';
import type { IOrgUnit } from '@/types/org-unit';
import type { Role } from '@/types/authorization/role';
import type {
  AccessRecord,
  CreateRoleAccessInput,
  CreateRoleAssignmentInput,
  RoleAccessRecord,
  RoleAssignmentRecord,
} from '@/types/authorization/role-management';

export async function getAccesses(): Promise<AccessRecord[]> {
  const response = await AppApi<AccessRecord[]>('/accesses');
  return response.data;
}

export async function getUnitsForRoles(): Promise<IOrgUnit[]> {
  const response = await AppApi<IOrgUnit[]>('/units');
  return response.data;
}

export async function getRoleAccessLinks(): Promise<RoleAccessRecord[]> {
  const response = await AppApi<RoleAccessRecord[]>('/role-accesses');
  return response.data;
}

export async function createRoleAccessLink(input: CreateRoleAccessInput) {
  const response = await AppApi<RoleAccessRecord>('/role-accesses', {
    method: 'POST',
    data: input,
  });
  return response.data;
}

export async function getRoleAssignments(): Promise<RoleAssignmentRecord[]> {
  const response = await AppApi<RoleAssignmentRecord[]>('/role-assignments');
  return response.data;
}

export async function createRoleAssignment(input: CreateRoleAssignmentInput) {
  const response = await AppApi<RoleAssignmentRecord>('/role-assignments', {
    method: 'POST',
    data: input,
  });
  return response.data;
}

export type RoleOption = Pick<Role, 'id' | 'name' | 'farsiName' | 'unit_id'>;
