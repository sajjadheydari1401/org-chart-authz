import 'server-only';

import { AppApi } from '@/lib/api/server';
import type { IOrgUnit } from '@/types/org-unit';

export async function getUnits(): Promise<IOrgUnit[]> {
  const response = await AppApi<IOrgUnit[]>('/units');
  return response.data;
}
