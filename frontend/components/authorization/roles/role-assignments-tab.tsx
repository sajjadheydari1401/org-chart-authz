'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AppTable,
  type AppTableColumn,
} from '@/components/common/ui/app-table/app-table';
import { AppTableActions } from '@/components/common/ui/app-table/AppTableActions';
import { AppDialog } from '@/components/common/ui/app-dialog';
import { hasRequiredAccess } from '@/lib/workspace-navigation';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination';
import { getRoleAssignments } from '@/services/authorization/role-management.service';
import { getRoles } from '@/services/authorization/roles/roles.service';
import { getUsers } from '@/services/authorization/users/users.service';
import type { EffectiveAccess } from '@/types/authorization/access';
import type { RoleAssignmentRecord } from '@/types/authorization/role-management';
import { CreateRoleAssignmentForm } from './create-role-assignment-form';

const columns: AppTableColumn<RoleAssignmentRecord>[] = [
  {
    key: 'user-name',
    header: 'کاربر',
    render: (record) => record.user.username,
  },
  {
    key: 'user-type',
    header: 'نوع کاربر',
    render: (record) => (record.user.isManager ? 'مدیر' : 'کاربر'),
  },
  {
    key: 'role-name',
    header: 'نقش',
    render: (record) => record.role.farsiName || record.role.name,
  },
  {
    key: 'role-unit',
    header: 'شناسه واحد',
    render: (record) => record.role.unit_id,
  },
];

export function RoleAssignmentsTab({
  accesses,
}: {
  accesses: readonly EffectiveAccess[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(DEFAULT_PAGE_SIZE);
  const queryClient = useQueryClient();
  const canReadAssignments = hasRequiredAccess(
    { route: '/role-assignments', methodName: 'GET' },
    accesses,
  );
  const canReadRoles = hasRequiredAccess(
    { route: '/roles', methodName: 'GET' },
    accesses,
  );
  const canReadUsers = hasRequiredAccess(
    { route: '/users', methodName: 'GET' },
    accesses,
  );
  const canCreateAssignment =
    canReadRoles &&
    canReadUsers &&
    hasRequiredAccess(
      { route: '/role-assignments', methodName: 'POST' },
      accesses,
    );

  const assignmentsQuery = useQuery({
    queryKey: ['role-assignments'],
    queryFn: getRoleAssignments,
    enabled: canReadAssignments,
  });
  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    enabled: canCreateAssignment,
  });
  const usersQuery = useQuery({
    queryKey: ['users', 'role-assignment-options', userPage, userPageSize],
    queryFn: () => getUsers({ page: userPage, pageSize: userPageSize }),
    enabled: canCreateAssignment,
  });

  if (!canReadAssignments) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        شما به فهرست تخصیص نقش‌ها دسترسی ندارید.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {canCreateAssignment && (
        <div className="flex justify-end">
          <AppTableActions
            title="تخصیص نقش"
            icon={<Plus />}
            onClick={() => setDialogOpen(true)}
          />
        </div>
      )}
      {assignmentsQuery.isPending ? (
        <p role="status" className="py-8 text-center text-muted-foreground">
          در حال بارگذاری تخصیص نقش‌ها...
        </p>
      ) : assignmentsQuery.isError ? (
        <p role="alert" className="py-8 text-center text-destructive">
          {assignmentsQuery.error.message || 'دریافت تخصیص نقش‌ها ناموفق بود.'}
        </p>
      ) : (
        <AppTable
          columns={columns}
          data={assignmentsQuery.data}
          rowKey={(record) => record.id}
          rowLabel={(record) =>
            `${record.user.username} ${record.role.farsiName}`
          }
          caption="نقش‌های تخصیص‌یافته به کاربران"
          emptyMessage="تخصیص نقشی ثبت نشده است."
        />
      )}

      {canCreateAssignment && (
        <AppDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="تخصیص نقش به کاربر"
          description="کاربر و نقش موردنظر را انتخاب کنید."
          size="lg"
        >
          <CreateRoleAssignmentForm
            roles={rolesQuery.data ?? []}
            rolesLoading={rolesQuery.isPending}
            users={usersQuery.data?.items ?? []}
            usersLoading={usersQuery.isPending}
            pagination={usersQuery.data?.pagination}
            userPage={userPage}
            userPageSize={userPageSize}
            isFetchingUsers={usersQuery.isFetching}
            onUserPageChange={setUserPage}
            onUserPageSizeChange={setUserPageSize}
            onSuccess={async () => {
              await queryClient.invalidateQueries({
                queryKey: ['role-assignments'],
              });
              setDialogOpen(false);
            }}
          />
        </AppDialog>
      )}
    </div>
  );
}
