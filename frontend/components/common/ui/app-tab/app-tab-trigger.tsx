"use client";

import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";
import type { AppTabController } from "./use-app-tab";

export type AppTabTriggerProps = Omit<ComponentPropsWithRef<"button">, "value"> & { value: string; tabs: AppTabController };

export function AppTabTrigger({ tabs, value, disabled, className, onClick, onFocus, ...props }: AppTabTriggerProps) {
  const selected = tabs.value === value;

  return (
    <button
      {...props}
      type="button"
      role="tab"
      id={tabs.triggerId(value)}
      aria-controls={tabs.panelId(value)}
      aria-selected={selected}
      disabled={disabled}
      tabIndex={selected && !disabled ? 0 : -1}
      className={cn(
        "inline-flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-muted-foreground disabled:opacity-50",
        selected ? "bg-surface text-primary" : "text-muted-foreground enabled:hover:bg-surface enabled:hover:text-foreground",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) tabs.select(value);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (!event.defaultPrevented && !disabled) tabs.select(value);
      }}
    />
  );
}
