import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface AppCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function AppCard({ children, className, ...props }: AppCardProps) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-xl border border-border bg-surface text-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
