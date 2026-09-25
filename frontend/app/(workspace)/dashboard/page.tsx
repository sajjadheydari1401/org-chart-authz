import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { OrganizationGraph } from "@/components/units-chart/organization-graph";
import { routes } from "@/lib/routes";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Workspace</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Manage roles, users, organizational units, and resources.
        </p>
      </header>

      <section aria-labelledby="management-heading" className="space-y-4">
        <div>
          <h2
            id="management-heading"
            className="text-lg font-semibold text-foreground"
          >
            Workspace management
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose an area to manage.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            href={routes.roles}
            title="Roles"
            description="Manage roles and their permissions."
          />

          <DashboardCard
            href={routes.users}
            title="Users"
            description="Manage users in your organization."
          />

          <DashboardCard
            href={routes.orgUnits}
            title="Org Units"
            description="Manage organizational units and their hierarchy."
          />

          <DashboardCard
            href={routes.resources}
            title="Resources"
            description="Manage resources and access permissions."
          />
        </div>
      </section>

      <section aria-labelledby="organization-heading" className="space-y-4">
        <div>
          <h2
            id="organization-heading"
            className="text-lg font-semibold text-foreground"
          >
            Organization chart
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            View the hierarchy of your organizational units.
          </p>
        </div>
        <OrganizationGraph />
      </section>
    </div>
  );
}
