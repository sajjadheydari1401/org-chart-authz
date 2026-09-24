import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { AppButton } from "@/components/common/ui/app-button";
import { AppLink } from "@/components/common/ui/app-link";
import { getAccessToken } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-6 px-6">
          <div className="flex items-center gap-8">
            <AppLink href="/dashboard" className="font-semibold tracking-tight">
              Org Chart
            </AppLink>

            <nav
              aria-label="Dashboard navigation"
              className="hidden items-center gap-1 sm:flex"
            >
              <AppLink href="/dashboard" variant="nav">
                Overview
              </AppLink>

              <AppLink href="/dashboard/org-chart" variant="nav">
                Org chart
              </AppLink>

              <AppLink href="/dashboard/people" variant="nav">
                People
              </AppLink>
            </nav>
          </div>

          <form action={logoutAction}>
            <AppButton type="submit" variant="secondary" size="sm">
              Sign out
            </AppButton>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
