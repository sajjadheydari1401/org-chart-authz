import { OrganizationGraph } from '@/components/units-chart/organization-graph';
import { requireWorkspaceAccess } from '@/lib/auth/workspace-access';

export default async function OrganizationChartPage() {
  await requireWorkspaceAccess('/organization-chart');

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">
          چارت سازمانی مجتمع
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          ساختار مدیریت، بهره‌برداری، امور مالی، قراردادها و خدمات مجتمع تجاری
          سیمرغ.
        </p>
      </header>
      <section aria-label="نمودار ساختار مجتمع">
        <OrganizationGraph />
      </section>
    </div>
  );
}
