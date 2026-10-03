'use client';

import {
  AppTable,
  type AppTableColumn,
} from '@/components/common/ui/app-table/app-table';
import { AppPagination } from '@/components/common/ui/app-pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/pagination';
import type { PaginationMeta } from '@/types/api';
import type { UserDirectoryRecord } from '@/types/user';

const columns: AppTableColumn<UserDirectoryRecord>[] = [
  { key: 'username', header: 'نام کاربری' },
  {
    key: 'email',
    header: 'ایمیل',
    render: (user) => user.email ?? '—',
  },
  {
    key: 'mobile',
    header: 'شماره همراه',
    render: (user) => user.mobile ?? '—',
  },
];

export function UsersTable({
  users,
  pagination,
  caption,
  isFetching,
  onPageChange,
  onPageSizeChange,
}: {
  users: readonly UserDirectoryRecord[];
  pagination: PaginationMeta;
  caption: string;
  isFetching: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  return (
    <div className="space-y-4">
      <AppTable
        columns={columns}
        data={users}
        rowKey={(user) => user.id}
        rowLabel={(user) => user.username}
        caption={caption}
        emptyMessage="کاربری در این محدوده پیدا نشد."
      />
      <AppPagination
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        disabled={isFetching}
      />
    </div>
  );
}
