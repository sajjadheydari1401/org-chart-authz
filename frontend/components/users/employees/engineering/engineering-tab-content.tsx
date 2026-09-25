import { AppCard } from "@/components/common/ui/card/app-card";
import { AppCardContent } from "@/components/common/ui/card/app-card-content";
import { EngineeringTabs } from "./engineering-tabs";

export function EngineeringTabContent() {
  return (
    <AppCard>
      <AppCardContent>
        <EngineeringTabs />
      </AppCardContent>
    </AppCard>
  );
}
