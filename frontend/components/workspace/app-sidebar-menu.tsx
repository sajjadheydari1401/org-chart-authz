"use client";

import { usePathname } from "next/navigation";
import { Building2, X } from "lucide-react";

import { AppButton } from "@/components/common/ui/app-button";
import { AppLink } from "@/components/common/ui/app-link";
import { workspaceNavigation } from "@/lib/workspace-navigation";
import { cn } from "@/lib/cn";
import { AppSidebarMenuSection } from "./app-sidebar-menu-section";

interface AppSideBarMenuProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function AppSideBarMenu({ mobileOpen, onClose }: AppSideBarMenuProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="بستن منو"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-foreground/30 lg:hidden"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(19rem,calc(100vw-2rem))] flex-col border-l border-border bg-surface transition-transform motion-reduce:transition-none lg:sticky lg:top-16 lg:z-auto lg:h-[calc(100dvh-4rem)] lg:w-72 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex min-h-16 items-center justify-between border-b border-border px-4 lg:hidden">
          <AppLink
            href="/dashboard"
            onClick={onClose}
            className="flex min-w-0 items-center gap-2 font-semibold text-foreground"
          >
            <Building2
              className="size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span className="truncate">مجتمع تجاری سیمرغ</span>
          </AppLink>
          <AppButton
            type="button"
            variant="ghost"
            size="sm"
            aria-label="بستن منو"
            title="بستن منو"
            onClick={onClose}
            className="shrink-0 px-2"
          >
            <X className="size-4" />
          </AppButton>
        </div>
        <nav
          aria-label="منوی اصلی"
          className="min-h-0 flex-1 overflow-y-auto px-3 pb-5"
        >
          {workspaceNavigation.map((section) => (
            <AppSidebarMenuSection
              key={section.label}
              section={section}
              pathname={pathname}
              onNavigate={onClose}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
