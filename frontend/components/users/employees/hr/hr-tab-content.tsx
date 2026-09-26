import { AppCard } from "@/components/common/ui/card/app-card";
import { AppCardContent } from "@/components/common/ui/card/app-card-content";
import { HrTabs } from "./hr-tabs";

export function HrTabContent() {
  return (
    <AppCard>
      <AppCardContent>
        <HrTabs />
      </AppCardContent>
    </AppCard>
  );
}
