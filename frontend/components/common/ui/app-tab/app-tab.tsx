"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useAppTab } from "./use-app-tab";
import { AppTabList } from "./app-tab-list";
import { AppTabTrigger } from "./app-tab-trigger";
import { AppTabContent } from "./app-tab-content";

export interface AppTabName<Value extends string = string> {
  value: Value;
  label: string;
  disabled?: boolean;
}

export type AppTabProps<Value extends string = string> = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "defaultValue"
> & {
  tabNames: readonly AppTabName<Value>[];
  tabContents: Record<NoInfer<Value>, ReactNode>;
  tabListLabel?: string;
  listClassName?: string;
  contentClassName?: string;
  value: NoInfer<Value>;
  onValueChange: (value: Value) => void;
};

export function AppTab<Value extends string>({
  tabNames,
  tabContents,
  tabListLabel = "Sections",
  listClassName,
  contentClassName,
  value,
  onValueChange,
  className,
  ...props
}: AppTabProps<Value>) {
  const tabs = useAppTab({ tabNames, value, onValueChange });

  return (
    <div
      {...props}
      data-value={tabs.value}
      className={cn("min-w-0 space-y-4", className)}
    >
      <AppTabList aria-label={tabListLabel} className={listClassName}>
        {tabNames.map((tab) => (
          <AppTabTrigger
            key={tab.value}
            tabs={tabs}
            value={tab.value}
            disabled={tab.disabled}
          >
            {tab.label}
          </AppTabTrigger>
        ))}
      </AppTabList>
      {tabNames.map((tab) => (
        <AppTabContent
          key={tab.value}
          tabs={tabs}
          value={tab.value}
          className={contentClassName}
        >
          {tabContents[tab.value]}
        </AppTabContent>
      ))}
    </div>
  );
}
