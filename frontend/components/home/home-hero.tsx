import { LayoutDashboard } from 'lucide-react';

import { AppBadge } from '@/components/common/ui/app-badge';
import { AppLink } from '@/components/common/ui/app-link';

export function HomeHero() {
  return (
    <section className="border-b border-border py-10 sm:py-12">
      <AppBadge variant="primary" dot>
        سامانه یکپارچه مدیریت مجتمع
      </AppBadge>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            مدیریت مجتمع، از یک نقطه
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            واحدها، کاربران و اطلاعات عملیاتی را در یک فضای کاری منسجم دنبال
            کنید. این سامانه برای پیوند دادن امور ملکی، قراردادی و مالی مجتمع
            طراحی می‌شود.
          </p>
        </div>
        <AppLink href="/dashboard" variant="primary" className="gap-2">
          ورود به داشبورد
          <LayoutDashboard className="size-4" aria-hidden="true" />
        </AppLink>
      </div>
    </section>
  );
}
