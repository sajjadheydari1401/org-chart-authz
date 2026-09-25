"use client";

import { useId } from "react";

export interface UseAppTabOptions<Value extends string = string> {
  tabNames: readonly { value: Value; disabled?: boolean }[];
  value: Value;
  onValueChange: (value: Value) => void;
}

export interface AppTabController {
  value: string;
  select: (value: string) => void;
  triggerId: (value: string) => string;
  panelId: (value: string) => string;
}


export function useAppTab<Value extends string>({
  tabNames,
  value,
  onValueChange,
}: UseAppTabOptions<Value>): AppTabController {
  // Each group gets its own ID prefix.
  const id = useId();

  function select(nextValue: string) {
    const nextTab = tabNames.find((tab) => tab.value === nextValue && !tab.disabled);
    if (!nextTab || nextTab.value === value) return;

    onValueChange(nextTab.value);
  }

  return {
    value,
    select,
    triggerId: (tabValue) => `${id}-tab-${tabValue}`,
    panelId: (tabValue) => `${id}-panel-${tabValue}`,
  };
}
