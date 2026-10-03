'use client';

import { useState } from 'react';
import {
  AppTable,
  AppTableColumn,
} from '@/components/common/ui/app-table/app-table';
import type { IOrgUnit } from '@/types/org-unit';

export function OrgUnitsTable({
  filteredUnits,
  allUnits,
  caption,
}: {
  filteredUnits: readonly IOrgUnit[];
  allUnits: readonly IOrgUnit[];
  caption: string;
}) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const unitNameById = new Map(allUnits.map((unit) => [unit.id, unit.name]));
  const columns: AppTableColumn<IOrgUnit>[] = [
    { key: 'id', header: 'شناسه' },
    { key: 'name', header: 'نام' },
    {
      key: 'parentId',
      header: 'واحد بالادست',
      render: (unit) =>
        unit.parentId === null ? '—' : (unitNameById.get(unit.parentId) ?? '—'),
    },
  ];

  return (
    <AppTable
      columns={columns}
      data={filteredUnits}
      rowKey={(unit) => unit.id}
      rowLabel={(unit) => unit.name}
      caption={caption}
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
    />
  );
}
