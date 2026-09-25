import { AppCard } from "@/components/common/ui/card/app-card";
import { AppCardContent } from "@/components/common/ui/card/app-card-content";
import { EmployeeTabs } from "./employee-tabs";

export function Employees() {
  return (
    <AppCard>
      <AppCardContent>
        <EmployeeTabs />
      </AppCardContent>
    </AppCard>
  );
}
