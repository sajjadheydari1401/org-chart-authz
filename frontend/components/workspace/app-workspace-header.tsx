'use client';

import { Building2, Menu } from 'lucide-react';

import { LogoutButton } from '@/components/auth/logout-button';
import { AppButton } from '@/components/common/ui/app-button';
import { AppLink } from '@/components/common/ui/app-link';

interface AppWorkspaceHeaderProps {
  onOpenMenu: () => void;
}

export function AppWorkspaceHeader({ onOpenMenu }: AppWorkspaceHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <div className="mx-auto flex min-h-16 w-full max-w-[100rem] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <AppButton
            type="button"
            variant="secondary"
            size="sm"
            aria-label="باز کردن منو"
            title="باز کردن منو"
            onClick={onOpenMenu}
            className="shrink-0 px-2 lg:hidden"
          >
            <Menu className="size-4" />
          </AppButton>
          <AppLink
            href="/dashboard"
            className="flex min-w-0 items-center gap-2 font-semibold tracking-tight text-foreground"
          >
            <Building2
              className="size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span className="truncate">مدیریت مجتمع تجاری</span>
          </AppLink>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
