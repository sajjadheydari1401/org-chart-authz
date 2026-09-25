import { AppCard } from "@/components/common/ui/card/app-card";
import { AppCardContent } from "@/components/common/ui/card/app-card-content";
import { UserStatusTabs } from "./user-status-tabs";

export function OrganizationUsers() {
  return (
    <AppCard>
      <AppCardContent className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Organization users</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Browse the sample users by account status.
          </p>
        </div>
        <UserStatusTabs />
      </AppCardContent>
    </AppCard>
  );
}
