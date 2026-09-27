import { ChevronLeft } from "lucide-react";

import { AppLink } from "@/components/common/ui/app-link";
import { cn } from "@/lib/cn";

export interface AppBreadCrumbItem {
  label: string;
  href?: string;
}

export interface AppBreadCrumbsProps {
  items: readonly AppBreadCrumbItem[];
  className?: string;
}

export function AppBreadCrumbs({ items, className }: AppBreadCrumbsProps) {
  if (!items.length) return null;

  return (
    <nav aria-label="مسیر صفحه" className={cn("mb-5 min-w-0", className)}>
      <ol className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const current = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${item.href ?? "current"}`}
              className="flex min-w-0 items-center gap-2"
            >
              {index > 0 && (
                <ChevronLeft
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-muted-foreground"
                />
              )}
              {item.href && !current ? (
                <AppLink
                  href={item.href}
                  className="min-w-0 text-muted-foreground hover:text-foreground"
                >
                  <span className="[overflow-wrap:anywhere]">{item.label}</span>
                </AppLink>
              ) : (
                <span
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "min-w-0 [overflow-wrap:anywhere]",
                    current
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
