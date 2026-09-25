"use client";

import { useState } from "react";
import {
  AppTable,
  AppTableColumn,
} from "@/components/common/ui/app-table/app-table";
import { rawUnits } from "@/data/org-units";
import type { IOrgUnit } from "@/types/org-unit";

const unitNames = new Map(rawUnits.map((unit) => [unit.id, unit.name]));

const columns: AppTableColumn<IOrgUnit>[] = [
  { key: "id", header: "شناسه" },
  { key: "name", header: "نام" },
  {
    key: "parentId",
    header: "واحد بالادست",
    render: (unit) =>
      unit.parentId === null ? "—" : (unitNames.get(unit.parentId) ?? "—"),
  },
];

export function OrgUnitsTable({ units, caption }: { units: readonly IOrgUnit[]; caption: string }) {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  return (
    <AppTable
      columns={columns}
      data={units}
      rowKey={(unit) => unit.id}
      rowLabel={(unit) => unit.name}
      caption={caption}
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
    />
  );
}
