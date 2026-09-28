import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { AppWorkspaceShell } from '@/components/workspace/app-workspace-shell';
import { getAccessToken } from '@/lib/auth/session';

export default async function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    redirect('/login');
  }

  return <AppWorkspaceShell>{children}</AppWorkspaceShell>;
}
