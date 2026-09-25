import { InfoCard } from "@/components/common/info-card";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { OrganizationGraph } from "@/components/units-chart/organization-graph";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Workspace</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Manage your organization structure, people, roles, and access.
        </p>
      </header>

      <section aria-labelledby="organization-heading" className="space-y-4">
        <OrganizationGraph />
        <div>
          <h2
            id="organization-heading"
            className="text-lg font-semibold text-foreground"
          >
            Organization
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose an area to manage.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            href="/dashboard/org-chart"
            title="Organization chart"
            description="View and manage reporting relationships across your organization."
          />

          <DashboardCard
            href="/dashboard/people"
            title="People"
            description="View and manage people in your organization."
          />

          <DashboardCard
            href="/dashboard/access"
            title="Roles & permissions"
            description="Manage application roles, permissions, and access."
          />
        </div>
      </section>

      <InfoCard title="Secure workspace">
        Access to protected organization data is validated by the backend using
        your authenticated session.
      </InfoCard>
    </div>
  );
}
