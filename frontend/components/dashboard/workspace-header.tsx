import { logoutAction } from "@/app/actions/auth";
import { AppButton } from "@/components/common/ui/app-button";
import { AppLink } from "@/components/common/ui/app-link";
import { routes } from "@/lib/routes";

const navigation = [
  { label: "کاربران", href: routes.users },
  { label: "واحدهای سازمانی", href: routes.orgUnits },
  { label: "نقش‌ها", href: routes.roles },
  { label: "منابع", href: routes.resources },
  { label: "دسترسی‌ها", href: routes.accesses },
];

export function WorkspaceHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <AppLink
          href={routes.dashboard}
          className="font-semibold tracking-tight"
        >
          چارت سازمانی سیمرغ
        </AppLink>

        <nav
          aria-label="Workspace navigation"
          className="order-last flex w-full flex-wrap items-center gap-1 md:order-0 md:w-auto"
        >
          {navigation.map(({ label, href }) => (
            <AppLink
              key={href}
              href={href}
              variant="nav"
              className="inline-flex min-h-11 items-center"
            >
              {label}
            </AppLink>
          ))}
        </nav>

        <form action={logoutAction}>
          <AppButton type="submit" variant="secondary" size="sm">
            خروج
          </AppButton>
        </form>
      </div>
    </header>
  );
}
