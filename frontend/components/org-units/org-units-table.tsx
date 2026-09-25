"use client";

import { useState } from "react";
import {
  AppTable,
  AppTableColumn,
} from "@/components/common/ui/app-table/app-table";
import { rawUnits } from "@/data/org-units";
import type { OrgUnit } from "@/types/org-unit";

const unitNames = new Map(rawUnits.map((unit) => [unit.id, unit.name]));

const columns: AppTableColumn<OrgUnit>[] = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  {
    key: "parentId",
    header: "Parent unit",
    render: (unit) =>
      unit.parentId === null ? "—" : (unitNames.get(unit.parentId) ?? "—"),
  },
];

export function OrgUnitsTable() {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  return (
    <AppTable
      columns={columns}
      data={rawUnits}
      rowKey={(unit) => unit.id}
      rowLabel={(unit) => unit.name}
      caption="Organizational units"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
    />
  );
}
