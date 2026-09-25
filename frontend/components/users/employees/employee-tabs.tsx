"use client";

import { useState } from "react";
import { AppTab } from "@/components/common/ui/app-tab/app-tab";
import { EngineeringTabContent } from "./engineering/engineering-tab-content";

const TAB_NAMES = [
  { value: "engineering", label: "فنی و مهندسی" },
  { value: "finance", label: "مالی" },
  { value: "hr", label: "منابع انسانی" },
] as const;

const TAB_CONTENTS = {
  engineering: <EngineeringTabContent />,
  finance: <></>,
  hr: <></>,
};

export function EmployeeTabs() {
  const [value, setValue] =
    useState<(typeof TAB_NAMES)[number]["value"]>("engineering");

  return (
    <AppTab
      tabNames={TAB_NAMES}
      tabContents={TAB_CONTENTS}
      tabListLabel="واحدهای سازمانی"
      value={value}
      onValueChange={setValue}
    />
  );
}
