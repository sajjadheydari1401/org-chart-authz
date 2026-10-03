'use client';

import { useState } from 'react';
import {
  AppTab,
  type AppTabName,
} from '@/components/common/ui/app-tab/app-tab';
import type { EffectiveAccess } from '@/types/authorization/access';
import { RolesTab } from './roles-tab';

const TAB_NAMES = [
  { value: 'roles', label: 'نقش‌ها' },
] as const satisfies readonly AppTabName[];

export function RolesTabs({
  accesses,
}: {
  accesses: readonly EffectiveAccess[];
}) {
  const [value, setValue] =
    useState<(typeof TAB_NAMES)[number]['value']>('roles');
  const tabContents = { roles: <RolesTab accesses={accesses} /> };

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
