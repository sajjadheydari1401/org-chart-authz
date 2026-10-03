import { proxyAppApi } from '@/lib/api/proxy';
import type { CreateRoleAccessInput } from '@/types/authorization/role-management';

const backendPath = '/role-accesses/role-accesses';

export async function GET() {
  return proxyAppApi<unknown[]>(backendPath);
}

export async function POST(request: Request) {
  const input = (await request.json()) as CreateRoleAccessInput;
  return proxyAppApi(backendPath, { method: 'POST', data: input });
}
