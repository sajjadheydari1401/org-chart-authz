import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { OrganizationGraph } from "@/components/units-chart/organization-graph";
import { routes } from "@/lib/routes";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          داشبورد
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          مدیریت نقش‌ها، کاربران، واحدهای سازمانی و منابع.
        </p>
      </header>

      <section aria-labelledby="management-heading" className="space-y-4">
        <div>
          <h2
            id="management-heading"
            className="text-lg font-semibold text-foreground"
          >
            مدیریت فضای کاری
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            بخش موردنظر برای مدیریت را انتخاب کنید.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            href={routes.roles}
            title="نقش‌ها"
            description="مدیریت نقش‌ها و مجوزهای آن‌ها."
          />

          <DashboardCard
            href={routes.users}
            title="کاربران"
            description="مدیریت کاربران سازمان."
          />

          <DashboardCard
            href={routes.orgUnits}
            title="واحدهای سازمانی"
            description="مدیریت واحدهای سازمانی و ساختار سلسله‌مراتبی آن‌ها."
          />

          <DashboardCard
            href={routes.resources}
            title="منابع"
            description="مدیریت منابع و مجوزهای دسترسی."
          />
        </div>
      </section>

      <section aria-labelledby="organization-heading" className="space-y-4">
        <div>
          <h2
            id="organization-heading"
            className="text-lg font-semibold text-foreground"
          >
            چارت سازمانی
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            مشاهده ساختار سلسله‌مراتبی واحدهای سازمانی.
          </p>
        </div>
        {/* چارت سازمانی */}
        <OrganizationGraph />
      </section>
    </div>
  );
}
