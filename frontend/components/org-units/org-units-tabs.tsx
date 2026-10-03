'use client';

import { useState } from 'react';
import { AppTab } from '@/components/common/ui/app-tab/app-tab';
import type { IOrgUnit } from '@/types/org-unit';
import { OrgUnitsTable } from './org-units-table';
import { getDepartments, getTeams } from '@/utils/org-units';

const TAB_NAMES = [
  { value: 'departments', label: 'واحدها' },
  { value: 'teams', label: 'تیم‌ها' },
] as const;

export function OrgUnitsTabs({ units }: { units: readonly IOrgUnit[] }) {
  const [value, setValue] =
    useState<(typeof TAB_NAMES)[number]['value']>('departments');
  const tabContents = {
    departments: (
      <OrgUnitsTable
        units={getDepartments(units)}
        allUnits={units}
        caption="واحدهای سازمانی"
      />
    ),
    teams: (
      <OrgUnitsTable
        units={getTeams(units)}
        allUnits={units}
        caption="تیم‌ها"
      />
    ),
  };

  return (
    <AppTab
      tabNames={TAB_NAMES}
      tabContents={tabContents}
      tabListLabel="بخش‌های سازمان"
      value={value}
      onValueChange={setValue}
    />
  );
}
