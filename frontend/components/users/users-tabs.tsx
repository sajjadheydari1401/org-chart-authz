'use client';

import { useState } from 'react';
import { AppTab, AppTabName } from '@/components/common/ui/app-tab/app-tab';
import { useUsers } from '@/hooks/authorization/use-users';
import { UsersTable } from './users-table';

const TAB_NAMES: AppTabName[] = [
  { value: 'employees', label: 'کاربران' },
  { value: 'managers', label: 'مدیران' },
];

function renderUserTab(query: ReturnType<typeof useUsers>, caption: string) {
  if (query.isPending) {
    return (
      <p role="status" className="py-8 text-center text-muted-foreground">
        در حال بارگذاری کاربران...
      </p>
    );
  }

  if (query.isError) {
    return (
      <p role="alert" className="py-8 text-center text-destructive">
        {query.error instanceof Error
          ? query.error.message
          : 'دریافت کاربران ناموفق بود.'}
      </p>
    );
  }

  return (
    <UsersTable
      users={query.data.items}
      pagination={query.data.pagination}
      caption={caption}
      isFetching={query.isFetching}
      onPageChange={query.setPage}
      onPageSizeChange={query.setPageSize}
    />
  );
}

export function UsersTabs() {
  const [value, setValue] =
    useState<(typeof TAB_NAMES)[number]['value']>('employees');
  const usersQuery = useUsers(false, value === 'employees');
  const managersQuery = useUsers(true, value === 'managers');
  const tabContents = {
    employees: renderUserTab(usersQuery, 'فهرست کاربران'),
    managers: renderUserTab(managersQuery, 'فهرست مدیران'),
  };

  return (
    <AppTab
      tabNames={TAB_NAMES}
      tabContents={tabContents}
      tabListLabel="بخش‌های کاربران"
      value={value}
      onValueChange={setValue}
    />
  );
}
