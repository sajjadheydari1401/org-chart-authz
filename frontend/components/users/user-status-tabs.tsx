"use client";

import { useState } from "react";
import { AppTab } from "@/components/common/ui/app-tab/app-tab";

const TAB_NAMES = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

const TAB_CONTENTS = {
  active: (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4">
      <div className="min-w-0">
        <p className="font-medium">Alex Morgan</p>
        <p className="text-sm text-muted-foreground wrap-anywhere">alex@example.com</p>
      </div>
      <span className="rounded-lg bg-success-subtle px-3 py-1 text-sm text-success">Active</span>
    </div>
  ),
  inactive: (
    <p className="rounded-lg border border-border p-6 text-center text-sm text-muted-foreground">
      No inactive users in this preview.
    </p>
  ),
};

export function UserStatusTabs() {
  const [value, setValue] = useState<(typeof TAB_NAMES)[number]["value"]>("active");

  return (
    <AppTab
      tabNames={TAB_NAMES}
      tabContents={TAB_CONTENTS}
      tabListLabel="User status"
      value={value}
      onValueChange={setValue}
    />
  );
}
