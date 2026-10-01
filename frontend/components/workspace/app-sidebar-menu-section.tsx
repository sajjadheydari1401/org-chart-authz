'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/cn';
import { AppSidebarMenuItem } from './app-sidebar-menu-item';
import type { WorkspaceNavigationSection } from '@/types/menu';

interface AppSidebarMenuSectionProps {
  section: WorkspaceNavigationSection;
  pathname: string;
  onNavigate?: () => void;
  defaultExpanded?: boolean;
}

export function AppSidebarMenuSection({
  section,
  pathname,
  onNavigate,
  defaultExpanded = false,
}: AppSidebarMenuSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const itemsId = useId();

  return (
    <section className="space-y-1">
      <h2 className="pt-3">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={itemsId}
          onClick={() => setExpanded((value) => !value)}
          className="cursor-pointer flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 text-start text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="min-w-0 [overflow-wrap:anywhere]">
            {section.label}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'size-4 shrink-0 transition-transform motion-reduce:transition-none',
              !expanded && '-rotate-90',
            )}
          />
        </button>
      </h2>
      <ul id={itemsId} hidden={!expanded} className="space-y-1">
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
