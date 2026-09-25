import { logoutAction } from "@/app/actions/auth";
import { AppButton } from "@/components/common/ui/app-button";
import { AppLink } from "@/components/common/ui/app-link";
import { routes } from "@/lib/routes";

const navigation = [
  { label: "Roles", href: routes.roles },
  { label: "Users", href: routes.users },
  { label: "Org Units", href: routes.orgUnits },
  { label: "Resources", href: routes.resources },
];

export function WorkspaceHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <AppLink href={routes.dashboard} className="font-semibold tracking-tight">
          Org Chart
        </AppLink>

        <nav
          aria-label="Workspace navigation"
          className="order-last flex w-full flex-wrap items-center gap-1 md:order-none md:w-auto"
        >
          {navigation.map(({ label, href }) => (
            <AppLink key={href} href={href} variant="nav" className="inline-flex min-h-11 items-center">
              {label}
            </AppLink>
          ))}
        </nav>

        <form action={logoutAction}>
          <AppButton type="submit" variant="secondary" size="sm">
            Sign out
          </AppButton>
        </form>
      </div>
    </header>
  );
}
