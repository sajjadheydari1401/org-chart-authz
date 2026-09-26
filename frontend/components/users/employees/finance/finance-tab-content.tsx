import { AppCard } from "@/components/common/ui/card/app-card";
import { AppCardContent } from "@/components/common/ui/card/app-card-content";
import { FinanceTabs } from "./finance-tabs";

export function FinanceTabContent() {
  return (
    <AppCard>
      <AppCardContent>
        <FinanceTabs />
      </AppCardContent>
    </AppCard>
  );
}
