import { AppApi } from '@/lib/api/client';
import type { Role } from '@/types/authorization/role';
import type { CreateRoleInput } from '@/types/authorization/role-management';

export async function getRoles() {
  const response = await AppApi<Role[]>('/roles');
  return response.data;
}

export async function createRole(input: CreateRoleInput) {
  const response = await AppApi<Role>('/roles', {
    method: 'POST',
    data: input,
  });
  return response.data;
}
