import { proxyAppApi } from '@/lib/api/proxy';

export async function GET() {
  return proxyAppApi<unknown[]>('/roles');
}
