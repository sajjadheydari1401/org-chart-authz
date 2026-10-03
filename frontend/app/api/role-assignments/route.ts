import { proxyAppApi } from '@/lib/api/proxy';
import type { CreateRoleAssignmentInput } from '@/types/authorization/role-management';

export async function GET() {
  return proxyAppApi<unknown[]>('/role-assignments');
}

export async function POST(request: Request) {
  const input = (await request.json()) as CreateRoleAssignmentInput;
  return proxyAppApi('/role-assignments', { method: 'POST', data: input });
}
