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
import {
  getAccesses,
  getRoleAccessLinks,
} from '@/services/authorization/role-management.service';
import { getRoles } from '@/services/authorization/roles/roles.service';
import type { EffectiveAccess } from '@/types/authorization/access';
import type { RoleAccessRecord } from '@/types/authorization/role-management';
import { CreateRoleAccessForm } from './create-role-access-form';

const columns: AppTableColumn<RoleAccessRecord>[] = [
  {
    key: 'role',
    header: 'نقش',
    render: (record) => record.role.farsiName || record.role.name,
  },
  {
    key: 'access-description',
    header: 'روش دسترسی',
    render: (record) => record.access.methodName,
  },
  {
    key: 'access',
    header: 'توضیحات',
    render: (record) => record.access.description,
  },
];

export function RoleAccessesTab({
  accesses,
}: {
  accesses: readonly EffectiveAccess[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const canReadLinks = hasRequiredAccess(
    { route: '/role-accesses/role-accesses', methodName: 'GET' },
    accesses,
  );
  const canReadRoles = hasRequiredAccess(
    { route: '/roles', methodName: 'GET' },
    accesses,
  );
  const canReadAccesses = hasRequiredAccess(
    { route: '/accesses', methodName: 'GET' },
    accesses,
  );
  const canCreateLink =
    canReadRoles &&
    canReadAccesses &&
    hasRequiredAccess(
      { route: '/role-accesses/role-accesses', methodName: 'POST' },
      accesses,
    );

  const linksQuery = useQuery({
    queryKey: ['role-accesses'],
    queryFn: getRoleAccessLinks,
    enabled: canReadLinks,
  });
  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    enabled: canCreateLink,
  });
  const accessesQuery = useQuery({
    queryKey: ['accesses'],
    queryFn: getAccesses,
    enabled: canCreateLink,
  });

  if (!canReadLinks) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        شما به فهرست دسترسی‌های نقش‌ها دسترسی ندارید.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {canCreateLink && (
        <div className="flex justify-end">
          <AppTableActions
            title="افزودن دسترسی به نقش"
            icon={<Plus />}
            onClick={() => setDialogOpen(true)}
          />
        </div>
      )}
      {linksQuery.isPending ? (
        <p role="status" className="py-8 text-center text-muted-foreground">
          در حال بارگذاری دسترسی‌های نقش‌ها...
        </p>
      ) : linksQuery.isError ? (
        <p role="alert" className="py-8 text-center text-destructive">
          {linksQuery.error.message || 'دریافت دسترسی‌های نقش‌ها ناموفق بود.'}
        </p>
      ) : (
        <AppTable
          columns={columns}
          data={linksQuery.data}
          rowKey={(record) => `${record.roleId}-${record.accessId}`}
          rowLabel={(record) =>
            `${record.role.farsiName} ${record.access.methodName}`
          }
          caption="دسترسی‌های متصل به نقش‌ها"
          emptyMessage="دسترسی‌ای به نقشی متصل نشده است."
        />
      )}

      {canCreateLink && (
        <AppDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="افزودن دسترسی به نقش"
          description="نقش و دسترسی موردنظر را انتخاب کنید."
        >
          <CreateRoleAccessForm
            roles={rolesQuery.data ?? []}
            rolesLoading={rolesQuery.isPending}
            availableAccesses={accessesQuery.data ?? []}
            accessesLoading={accessesQuery.isPending}
            onSuccess={async () => {
              await queryClient.invalidateQueries({
                queryKey: ['role-accesses'],
              });
              setDialogOpen(false);
            }}
          />
        </AppDialog>
      )}
    </div>
  );
}
