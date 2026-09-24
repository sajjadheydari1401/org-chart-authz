import { FeatureCard } from "@/components/common/feature-card";
import { AppLink } from "@/components/common/ui/app-link";
import { AppCard } from "@/components/common/ui/card/app-card";
import { AppCardContent } from "@/components/common/ui/card/app-card-content";
import { AppCardHeader } from "@/components/common/ui/card/app-card-header";
import { AppCardTitle } from "@/components/common/ui/card/app-card-title";
import { getAccessToken } from "@/lib/auth/session";

export default async function Home() {
  const accessToken = await getAccessToken();
  const isAuthenticated = Boolean(accessToken);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6">
        <header className="flex min-h-20 items-center justify-between gap-6 border-b border-border">
          <AppLink href="/" className="text-lg font-semibold tracking-tight">
            Org Chart
          </AppLink>

          <nav aria-label="Main navigation" className="flex items-center gap-2">
            {isAuthenticated ? (
              <AppLink href="/dashboard" variant="primary">
                Dashboard
              </AppLink>
            ) : (
              <>
                <AppLink href="/login" variant="secondary">
                  Sign in
                </AppLink>

                <AppLink href="/signup" variant="primary">
                  Create account
                </AppLink>
              </>
            )}
          </nav>
        </header>

        <section className="flex flex-1 items-center py-16 sm:py-24">
          <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.75fr)] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">
                Organization management
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Your organization,
                <span className="block text-muted-foreground">
                  clearly structured.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Manage people, reporting relationships, roles, and permissions
                from one secure workspace.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <AppLink href="/dashboard" variant="primary">
                    Open dashboard
                  </AppLink>
                ) : (
                  <>
                    <AppLink href="/signup" variant="primary">
                      Create account
                    </AppLink>

                    <AppLink href="/login" variant="secondary">
                      Sign in
                    </AppLink>
                  </>
                )}
              </div>
            </div>

            <AppCard className="rounded-2xl">
              <AppCardHeader>
                <p className="text-sm font-medium text-muted-foreground">
                  Workspace
                </p>

                <AppCardTitle className="text-xl">
                  Everything in one place
                </AppCardTitle>
              </AppCardHeader>

              <AppCardContent className="space-y-3">
                <FeatureCard
                  title="Organization chart"
                  description="Understand reporting relationships and team structure."
                />

                <FeatureCard
                  title="People"
                  description="Manage the people who belong to your organization."
                />

                <FeatureCard
                  title="Roles and permissions"
                  description="Control application access through roles and permissions."
                />

                <FeatureCard
                  title="Secure access"
                  description="Protect accounts with password authentication and SMS verification."
                />
              </AppCardContent>
            </AppCard>
          </div>
        </section>

        <footer className="border-t border-border py-6">
          <p className="text-sm text-muted-foreground">Org Chart</p>
        </footer>
      </div>
    </main>
  );
}
