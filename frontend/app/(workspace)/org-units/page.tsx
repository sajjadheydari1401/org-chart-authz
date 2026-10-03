import { OrgUnitsTabs } from '@/components/org-units/org-units-tabs';
import { requireWorkspaceAccess } from '@/lib/auth/workspace-access';

export default async function OrgUnitsPage() {
  await requireWorkspaceAccess('/org-units');

  return (
    <div className="space-y-8">
      <header>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          واحدهای سازمانی
        </h1>
      </header>
      <OrgUnitsTabs />
    </div>
  );
}
