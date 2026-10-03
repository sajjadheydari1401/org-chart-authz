'use client';

import { useState } from 'react';
import {
  AppTable,
  AppTableColumn,
} from '@/components/common/ui/app-table/app-table';
import type { IOrgUnit } from '@/types/org-unit';

export function OrgUnitsTable({
  units,
  allUnits,
  caption,
}: {
  units: readonly IOrgUnit[];
  allUnits: readonly IOrgUnit[];
  caption: string;
}) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const unitNames = new Map(allUnits.map((unit) => [unit.id, unit.name]));
  const columns: AppTableColumn<IOrgUnit>[] = [
    { key: 'id', header: 'شناسه' },
    { key: 'name', header: 'نام' },
    {
      key: 'parentId',
      header: 'واحد بالادست',
      render: (unit) =>
        unit.parentId === null ? '—' : (unitNames.get(unit.parentId) ?? '—'),
    },
  ];

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
