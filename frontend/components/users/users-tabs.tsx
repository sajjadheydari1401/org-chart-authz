"use client";

import { useState } from "react";
import { AppTab, AppTabName } from "@/components/common/ui/app-tab/app-tab";
import { Managers } from "./managers/managers";
import { Employees } from "./employees/employees";

const TAB_NAMES: AppTabName[] = [
  { value: "employees", label: "کارمندان" },
  { value: "managers", label: "مدیران" },
];

const TAB_CONTENTS = {
  employees: <Employees />,
  managers: <Managers />,
};

export function UsersTabs() {
  const [value, setValue] =
    useState<(typeof TAB_NAMES)[number]["value"]>("employees");

  return (
    <AppTab
      tabNames={TAB_NAMES}
      tabContents={TAB_CONTENTS}
      tabListLabel="User management"
      value={value}
      onValueChange={setValue}
    />
  );
}
