import { proxyAppApi } from '@/lib/api/proxy';

export async function GET(request: Request) {
  const incomingUrl = new URL(request.url);
  const query = new URLSearchParams();

  for (const key of ['unitId', 'page', 'pageSize', 'isManager'] as const) {
    const value = incomingUrl.searchParams.get(key);
    if (value) query.set(key, value);
  }

  const path = query.size > 0 ? `/users?${query.toString()}` : '/users';

  return proxyAppApi(path);
}
