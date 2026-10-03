import { AppApi } from '@/lib/api/client';
import type { Role } from '@/types/authorization/role';

export async function getRoles() {
  const response = await AppApi<Role[]>('/roles');
  return response.data;
}
