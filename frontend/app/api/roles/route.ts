import { proxyAppApi } from '@/lib/api/proxy';
import type { CreateRoleInput } from '@/types/authorization/role-management';

export async function GET() {
  return proxyAppApi<unknown[]>('/roles');
}

export async function POST(request: Request) {
  const input = (await request.json()) as CreateRoleInput;
  return proxyAppApi('/roles', { method: 'POST', data: input });
}
