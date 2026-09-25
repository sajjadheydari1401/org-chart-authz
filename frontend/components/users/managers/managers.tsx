import { AppCard } from "@/components/common/ui/card/app-card";
import { AppCardContent } from "@/components/common/ui/card/app-card-content";
import { ManagersTable } from "./managers-table";

export function Managers() {
  return (
    <AppCard>
      <AppCardContent>
        <ManagersTable />
      </AppCardContent>
    </AppCard>
  );
}
