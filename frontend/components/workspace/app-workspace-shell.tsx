"use client";

import { useState, type ReactNode } from "react";
import { Building2, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { AppButton } from "@/components/common/ui/app-button";
import { AppBreadCrumbs } from "@/components/common/ui/app-breadcrumbs";
import { AppLink } from "@/components/common/ui/app-link";
import { getWorkspaceBreadcrumbs } from "@/lib/workspace-navigation";
import { AppSideBarMenu } from "./app-sidebar-menu";

export function AppWorkspaceShell({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const breadcrumbs = getWorkspaceBreadcrumbs(pathname);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-surface">
        <div className="mx-auto flex min-h-16 w-full max-w-[100rem] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <AppButton
              type="button"
              variant="secondary"
              size="sm"
              aria-label="باز کردن منو"
              title="باز کردن منو"
              onClick={() => setMobileMenuOpen(true)}
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
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[100rem]">
        <AppSideBarMenu
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <AppBreadCrumbs items={breadcrumbs} />
          {children}
        </main>
      </div>
    </div>
  );
}
