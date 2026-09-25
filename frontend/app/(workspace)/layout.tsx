import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { WorkspaceHeader } from "@/components/dashboard/workspace-header";
import { getAccessToken } from "@/lib/auth/session";

export default async function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    // redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <WorkspaceHeader />

      <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
