import { OrgUnitsTabs } from "@/components/org-units/org-units-tabs";

export default function OrgUnitsPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">Workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Org Units</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          View organizational units and their parent relationships.
        </p>
      </header>
      <OrgUnitsTabs />
    </div>
  );
}
