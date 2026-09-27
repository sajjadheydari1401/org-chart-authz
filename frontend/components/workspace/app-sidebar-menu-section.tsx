"use client";

import { AppSidebarMenuItem } from "./app-sidebar-menu-item";
import type { WorkspaceNavigationSection } from "@/lib/workspace-navigation";

interface AppSidebarMenuSectionProps {
  section: WorkspaceNavigationSection;
  pathname: string;
  onNavigate?: () => void;
}

export function AppSidebarMenuSection({
  section,
  pathname,
  onNavigate,
}: AppSidebarMenuSectionProps) {
  return (
    <section className="space-y-1">
      <h2 className="px-3 pb-1 pt-4 text-xs font-semibold text-muted-foreground">
        {section.label}
      </h2>
      <ul className="space-y-1">
        {section.items.map((item) => (
          <li key={item.href}>
            <AppSidebarMenuItem
              item={item}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
