"use client";

import { useState } from "react";
import { AppTab } from "@/components/common/ui/app-tab/app-tab";
import { OrganizationUsers } from "./organization-users";
import { UserInvitations } from "./user-invitations";

const TAB_NAMES = [
  { value: "users", label: "Users" },
  { value: "invitations", label: "Invitations" },
  { value: "activity", label: "Activity", disabled: true },
] as const;

const TAB_CONTENTS = {
  users: <OrganizationUsers />,
  invitations: <UserInvitations />,
  activity: <p className="text-sm text-muted-foreground">Activity is unavailable in this preview.</p>,
};

export function UsersTabs() {
  const [value, setValue] = useState<(typeof TAB_NAMES)[number]["value"]>("users");

  return (
    <AppTab
      tabNames={TAB_NAMES}
      tabContents={TAB_CONTENTS}
      tabListLabel="User management"
      value={value}
      onValueChange={setValue}
    />
  );
}
