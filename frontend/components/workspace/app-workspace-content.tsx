'use client';

import type { ReactNode } from 'react';

import {
  AppBreadCrumbs,
  type AppBreadCrumbItem,
} from '@/components/common/ui/app-breadcrumbs';
import { AppSideBarMenu } from './app-sidebar-menu';

interface AppWorkspaceContentProps {
  breadcrumbs: readonly AppBreadCrumbItem[];
  mobileMenuOpen: boolean;
  onCloseMenu: () => void;
  children: ReactNode;
}

export function AppWorkspaceContent({
  breadcrumbs,
  mobileMenuOpen,
  onCloseMenu,
  children,
}: AppWorkspaceContentProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[100rem]">
      <AppSideBarMenu mobileOpen={mobileMenuOpen} onClose={onCloseMenu} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <AppBreadCrumbs items={breadcrumbs} />
        {children}
      </main>
    </div>
  );
}
