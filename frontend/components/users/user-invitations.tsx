import { AppCard } from "@/components/common/ui/card/app-card";
import { AppCardContent } from "@/components/common/ui/card/app-card-content";

export function UserInvitations() {
  return (
    <AppCard>
      <AppCardContent>
        <h2 className="text-lg font-semibold">Pending invitations</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">No pending invitations in this preview.</p>
      </AppCardContent>
    </AppCard>
  );
}
