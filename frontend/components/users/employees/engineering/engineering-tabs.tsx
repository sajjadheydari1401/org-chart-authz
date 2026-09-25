"use client";

import { useState } from "react";
import { AppTab } from "@/components/common/ui/app-tab/app-tab";
import { BackendTabContent } from "./backend/backend-tab-content";
import { FrontendTabContent } from "./frontend/frontend-tab-content";
import { DevopsTabContent } from "./devops/devops-tab-content";

const TAB_NAMES = [
  { value: "backend", label: "بک‌اند" },
  { value: "frontend", label: "فرانت‌اند" },
  { value: "devops", label: "دواپس" },
] as const;

const TAB_CONTENTS = {
  backend: <BackendTabContent />,
  frontend: <FrontendTabContent />,
  devops: <DevopsTabContent />,
};

export function EngineeringTabs() {
  const [value, setValue] = useState<(typeof TAB_NAMES)[number]["value"]>("backend");

  return (
    <AppTab
      tabNames={TAB_NAMES}
      tabContents={TAB_CONTENTS}
      tabListLabel="تیم‌های مهندسی"
      value={value}
      onValueChange={setValue}
    />
  );
}
