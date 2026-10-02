import axios from 'axios';
import type { RolesResponse } from '@/types/authorization/role';

export async function getRoles() {
  const response = await axios.get<RolesResponse>('/api/roles');
  return response.data.roles;
}
