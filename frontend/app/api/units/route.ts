import { proxyAppApi } from '@/lib/api/proxy';
import type { IOrgUnit } from '@/types/org-unit';

export async function GET() {
  return proxyAppApi<IOrgUnit[]>('/units');
}
