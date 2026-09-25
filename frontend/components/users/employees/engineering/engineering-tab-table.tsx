"use client";

import { useState } from "react";
import {
  AppTable,
  AppTableColumn,
} from "@/components/common/ui/app-table/app-table";
import { IEmployee } from "@/types/user";
import { AppTableActions } from "@/components/common/ui/app-table/AppTableActions";

const columns: AppTableColumn<IEmployee>[] = [
  { key: "id", header: "شناسه" },
  { key: "name", header: "نام" },
  {
    key: "email",
    header: "ایمیل",
    render: (employee) => employee.email ?? "---",
  },
  {
    key: "mobile",
    header: "شماره موبایل",
    render: (employee) => employee.mobile ?? "---",
  },
  {
    key: "actions",
    header: "عملیات",
    className: 'text-center',
    render: (employee) => (
      <AppTableActions
        onView={() => console.log("View:", employee)}
        onEdit={() => console.log("Edit:", employee)}
        onDelete={() => console.log("Delete:", employee)}
      />
    ),
  },
];

export function EngineeringTable({ employees }: { employees: readonly IEmployee[] }) {
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  return (
    <AppTable
      columns={columns}
      data={employees}
      rowKey={(employee) => employee.id}
      rowLabel={(employee) => employee.name}
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
    />
  );
}
