"use client";

import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";
import type { AppTabController } from "./use-app-tab";

export type AppTabContentProps = ComponentPropsWithRef<"div"> & { value: string; tabs: AppTabController };

export function AppTabContent({ tabs, value, className, ...props }: AppTabContentProps) {
  return (
    <div
      {...props}
      role="tabpanel"
      id={tabs.panelId(value)}
      aria-labelledby={tabs.triggerId(value)}
      hidden={tabs.value !== value}
      tabIndex={0}
      className={cn("min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", className, tabs.value !== value && "hidden")}
    />
  );
}
