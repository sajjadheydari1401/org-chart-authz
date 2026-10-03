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
import { getRoles } from '@/services/authorization/roles/roles.service';
import { getUnitsForRoles } from '@/services/authorization/role-management.service';
import type { EffectiveAccess } from '@/types/authorization/access';
import type { Role } from '@/types/authorization/role';
import { CreateRoleForm } from './create-role-form';

const columns: AppTableColumn<Role>[] = [
  { key: 'name', header: 'نام انگلیسی' },
  { key: 'farsiName', header: 'نام فارسی' },
  {
    key: 'scopeMode',
    header: 'محدوده نقش',
    render: (role) =>
      role.scopeMode === 'SELF' ? 'واحد خودش' : 'واحدهای زیرمجموعه',
  },
  { key: 'description', header: 'توضیحات' },
];

export function RolesTab({
  accesses,
}: {
  accesses: readonly EffectiveAccess[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const canReadRoles = hasRequiredAccess(
    { route: '/roles', methodName: 'GET' },
    accesses,
  );
  const canReadUnits = hasRequiredAccess(
    { route: '/units', methodName: 'GET' },
    accesses,
  );
  const canCreateRole =
    canReadUnits &&
    hasRequiredAccess({ route: '/roles', methodName: 'POST' }, accesses);

  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    enabled: canReadRoles,
  });
  const unitsQuery = useQuery({
    queryKey: ['units'],
    queryFn: getUnitsForRoles,
    enabled: canReadUnits,
  });
  const unitNameById = new Map(
    (unitsQuery.data ?? []).map((unit) => [unit.id, unit.name]),
  );
  const roleColumns: AppTableColumn<Role>[] = [
    ...columns.slice(0, 2),
    {
      key: 'unit_id',
      header: 'واحد',
      render: (role) => unitNameById.get(role.unit_id) ?? role.unit_id,
    },
    ...columns.slice(2),
  ];

  if (!canReadRoles) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        شما به فهرست نقش‌ها دسترسی ندارید.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {canCreateRole && (
        <div className="flex justify-end">
          <AppTableActions
            title="ایجاد نقش"
            icon={<Plus />}
            onClick={() => setDialogOpen(true)}
          />
        </div>
      )}
      {rolesQuery.isPending ? (
        <p role="status" className="py-8 text-center text-muted-foreground">
          در حال بارگذاری نقش‌ها...
        </p>
      ) : rolesQuery.isError ? (
        <p role="alert" className="py-8 text-center text-destructive">
          {rolesQuery.error.message || 'دریافت نقش‌ها ناموفق بود.'}
        </p>
      ) : (
        <AppTable
          columns={roleColumns}
          data={rolesQuery.data}
          rowKey={(role) => role.id}
          rowLabel={(role) => role.farsiName || role.name}
          caption="فهرست نقش‌ها"
          emptyMessage="نقشی ثبت نشده است."
        />
      )}

      {canCreateRole && (
        <AppDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="ایجاد نقش"
          description="اطلاعات نقش و محدوده واحدی آن را وارد کنید."
        >
          <CreateRoleForm
            units={unitsQuery.data ?? []}
            unitsLoading={unitsQuery.isPending}
            onSuccess={async () => {
              await queryClient.invalidateQueries({ queryKey: ['roles'] });
              setDialogOpen(false);
            }}
          />
        </AppDialog>
      )}
    </div>
  );
}
