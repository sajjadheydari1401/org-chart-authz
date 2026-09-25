"use client";

import { useState } from "react";
import { AppTab } from "@/components/common/ui/app-tab/app-tab";
import { AccountingTable } from "./accounting/accounting-tab-table";

const TAB_NAMES = [{ value: "accounting", label: "حسابداری" }] as const;
const TAB_CONTENTS = { accounting: <AccountingTable /> };

export function FinanceTabs() {
  const [value, setValue] = useState<(typeof TAB_NAMES)[number]["value"]>("accounting");

  return (
    <AppTab
      tabNames={TAB_NAMES}
      tabContents={TAB_CONTENTS}
      tabListLabel="تیم‌های مالی"
      value={value}
      onValueChange={setValue}
    />
  );
}
