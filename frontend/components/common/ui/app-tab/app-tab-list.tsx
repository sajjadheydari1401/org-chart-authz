"use client";

import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";

export type AppTabListProps = ComponentPropsWithRef<"div">;

export function AppTabList({
  className,
  ...props
}: AppTabListProps) {
  return (
    <div
      {...props}
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        "flex min-w-0 max-w-full gap-1 overflow-x-auto rounded-xl border border-border bg-muted p-1.5",
        className,
      )}
    />
  );
}
