"use client";

import { useState } from "react";
import { AppTab } from "@/components/common/ui/app-tab/app-tab";
import { OrgUnitsTable } from "./org-units-table";

const TAB_NAMES = [
  { value: "org-units", label: "Org Units" },
  { value: "new-tab", label: "New Tab" },
] as const;

const TAB_CONTENTS = {
  "org-units": <OrgUnitsTable />,
  "new-tab": null,
};

export function OrgUnitsTabs() {
  const [value, setValue] = useState<(typeof TAB_NAMES)[number]["value"]>("org-units");

  return (
    <AppTab
      tabNames={TAB_NAMES}
      tabContents={TAB_CONTENTS}
      tabListLabel="Org unit sections"
      value={value}
      onValueChange={setValue}
    />
  );
}
