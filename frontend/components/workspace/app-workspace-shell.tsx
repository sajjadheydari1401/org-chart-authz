'use client';

import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { getWorkspaceBreadcrumbs } from '@/lib/workspace-navigation';
import { AppWorkspaceContent } from './app-workspace-content';
import { AppWorkspaceHeader } from './app-workspace-header';

export function AppWorkspaceShell({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const breadcrumbs = getWorkspaceBreadcrumbs(pathname);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppWorkspaceHeader onOpenMenu={() => setMobileMenuOpen(true)} />
      <AppWorkspaceContent
        breadcrumbs={breadcrumbs}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMenu={() => setMobileMenuOpen(false)}
      >
        {children}
      </AppWorkspaceContent>
    </div>
  );
}
