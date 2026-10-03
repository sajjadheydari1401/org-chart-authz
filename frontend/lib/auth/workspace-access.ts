import 'server-only';

import { notFound, redirect } from 'next/navigation';
import { hasWorkspaceAccess } from '@/lib/workspace-navigation';
import { getCurrentUserAccesses } from '@/services/authorization/accesses/effective-accesses.service';
import type { EffectiveAccess } from '@/types/authorization/access';
import { ApiError } from '../api/api-error';

export async function getWorkspaceAccesses(): Promise<EffectiveAccess[]> {
  try {
    return await getCurrentUserAccesses();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect('/login');
    throw error;
  }
}

export async function requireWorkspaceAccess(href: string): Promise<void> {
  const accesses = await getWorkspaceAccesses();
  if (!hasWorkspaceAccess(href, accesses)) notFound();
}
