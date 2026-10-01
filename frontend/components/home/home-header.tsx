import { AppLink } from '@/components/common/ui/app-link';

export function HomeHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <AppLink href="/" className="font-semibold tracking-tight">
          سامانه مدیریت مجتمع تجاری
        </AppLink>
        <nav
          aria-label="ناوبری اصلی"
          className="flex flex-wrap items-center gap-2"
        >
          <AppLink href="/dashboard" variant="nav">
            داشبورد
          </AppLink>
        </nav>
      </div>
    </header>
  );
}
