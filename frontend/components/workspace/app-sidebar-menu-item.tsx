"use client";

import {
  Archive,
  Banknote,
  Building2,
  ChartNoAxesCombined,
  ClipboardList,
  FileText,
  Gauge,
  HandCoins,
  Inbox,
  KeyRound,
  UsersRound,
  Warehouse,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { AppLink } from "@/components/common/ui/app-link";
import type {
  WorkspaceIconKey,
  WorkspaceNavigationItem,
} from "@/lib/workspace-navigation";
import { cn } from "@/lib/cn";

const icons: Record<WorkspaceIconKey, LucideIcon> = {
  dashboard: Gauge,
  building: Building2,
  users: UsersRound,
  contract: FileText,
  vacancy: Warehouse,
  parking: Banknote,
  facility: Building2,
  maintenance: Wrench,
  finance: HandCoins,
  payment: Banknote,
  document: Archive,
  inbox: Inbox,
  workflow: ClipboardList,
  report: ChartNoAxesCombined,
  role: KeyRound,
};

interface AppSidebarMenuItemProps {
  item: WorkspaceNavigationItem;
  pathname: string;
  onNavigate?: () => void;
}

export function AppSidebarMenuItem({
  item,
  pathname,
  onNavigate,
}: AppSidebarMenuItemProps) {
  const Icon = icons[item.icon];
  const active = pathname === item.href;

  return (
    <AppLink
      href={item.href}
      variant="unstyled"
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "flex min-h-11 min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        active && "bg-accent text-accent-foreground hover:bg-accent",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="min-w-0 [overflow-wrap:anywhere]">{item.label}</span>
    </AppLink>
  );
}
