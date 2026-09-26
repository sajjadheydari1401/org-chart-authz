import { OrgUnitsTabs } from "@/components/org-units/org-units-tabs";

export default function OrgUnitsPage() {
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
