"use client";

import { useState } from "react";
import { AppTab } from "@/components/common/ui/app-tab/app-tab";
import { EmployeeAffairsTable } from "./employee-affairs/employee-affairs-tab-table";
import { RecruitmentTable } from "./recruitment/recruitment-tab-table";

const TAB_NAMES = [
  { value: "employee-affairs", label: "امور کارکنان" },
  { value: "recruitment", label: "استخدام" },
] as const;

const TAB_CONTENTS = {
  "employee-affairs": <EmployeeAffairsTable />,
  recruitment: <RecruitmentTable />,
};

export function HrTabs() {
  const [value, setValue] = useState<(typeof TAB_NAMES)[number]["value"]>("employee-affairs");

  return (
    <AppTab
      tabNames={TAB_NAMES}
      tabContents={TAB_CONTENTS}
      tabListLabel="تیم‌های منابع انسانی"
      value={value}
      onValueChange={setValue}
    />
  );
}
