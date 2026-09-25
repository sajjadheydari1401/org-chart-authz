"use client";

import { useState } from "react";
import { AppTable, type AppTableColumn } from "@/components/common/ui/app-table/app-table";
import { AppTableActions } from "@/components/common/ui/app-table/AppTableActions";
import { managers } from "@/data/managers";
import type { IManager } from "@/types/user";

const columns: AppTableColumn<IManager>[] = [
  { key: "id", header: "شناسه" },
  { key: "name", header: "نام" },
  { key: "department", header: "واحد سازمانی", render: (manager) => manager.department.name },
  { key: "email", header: "ایمیل", render: (manager) => manager.email ?? "---" },
  { key: "mobile", header: "شماره موبایل", render: (manager) => manager.mobile ?? "---" },
  {
    key: "actions",
    header: "عملیات",
    className: "text-center",
    render: (manager) => (
      <AppTableActions
        onView={() => console.log("View:", manager)}
        onEdit={() => console.log("Edit:", manager)}
        onDelete={() => console.log("Delete:", manager)}
      />
    ),
  },
];

export function ManagersTable() {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  return (
    <AppTable
      columns={columns}
      data={managers}
      rowKey={(manager) => manager.id}
      rowLabel={(manager) => manager.name}
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
    />
  );
}
