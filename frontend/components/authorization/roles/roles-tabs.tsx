'use client';

import { useState } from 'react';
import {
  AppTab,
  type AppTabName,
} from '@/components/common/ui/app-tab/app-tab';
import type { EffectiveAccess } from '@/types/authorization/access';
import { RoleAccessesTab } from './role-accesses-tab';
import { RoleAssignmentsTab } from './role-assignments-tab';
import { RolesTab } from './roles-tab';

const TAB_NAMES = [
  { value: 'roles', label: 'نقش‌ها' },
  { value: 'role-accesses', label: 'دسترسی نقش‌ها' },
  { value: 'role-assignments', label: 'تخصیص نقش' },
] as const satisfies readonly AppTabName[];

export function RolesTabs({
  accesses,
}: {
  accesses: readonly EffectiveAccess[];
}) {
  const [value, setValue] =
    useState<(typeof TAB_NAMES)[number]['value']>('roles');
  const tabContents = {
    roles: <RolesTab accesses={accesses} />,
    'role-accesses': <RoleAccessesTab accesses={accesses} />,
    'role-assignments': <RoleAssignmentsTab accesses={accesses} />,
  };

  return (
    <AppTab
      tabNames={TAB_NAMES}
      tabContents={tabContents}
      tabListLabel="بخش‌های مدیریت نقش"
      value={value}
      onValueChange={setValue}
    />
  );
}
