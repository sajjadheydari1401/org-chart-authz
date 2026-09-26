"use client";

import { useState } from "react";
import { AppTab } from "@/components/common/ui/app-tab/app-tab";
import { OrgUnitsTable } from "./org-units-table";
import { rawUnits } from "@/data/org-units";
import { getDepartments, getTeams } from "@/utils/org-units";

const TAB_NAMES = [
  { value: "departments", label: "واحدها" },
  { value: "teams", label: "تیم‌ها" },
] as const;

const TAB_CONTENTS = {
  departments: <OrgUnitsTable units={getDepartments(rawUnits)} caption="واحدهای سازمانی" />,
  teams: <OrgUnitsTable units={getTeams(rawUnits)} caption="تیم‌ها" />,
};

export function OrgUnitsTabs() {
  const [value, setValue] =
    useState<(typeof TAB_NAMES)[number]["value"]>("departments");

  return (
    <AppTab
      tabNames={TAB_NAMES}
      tabContents={TAB_CONTENTS}
      tabListLabel="بخش‌های سازمان"
      value={value}
      onValueChange={setValue}
    />
  );
}
