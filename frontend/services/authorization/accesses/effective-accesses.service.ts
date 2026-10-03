import 'server-only';

import { AppApi } from '@/lib/api/server';
import type { EffectiveAccess } from '@/types/authorization/access';

export async function getCurrentUserAccesses(): Promise<EffectiveAccess[]> {
  const response = await AppApi<EffectiveAccess[]>('/me/accesses');
  return response.data;
}
