import {
  Activity,
  Building2,
  CalendarClock,
  CarFront,
  FileText,
  HandCoins,
  Wrench,
} from 'lucide-react';

import { AppBadge } from '@/components/common/ui/app-badge';
import { AppLink } from '@/components/common/ui/app-link';
import { AppCard } from '@/components/common/ui/card/app-card';
import { AppCardContent } from '@/components/common/ui/card/app-card-content';

const metrics = [
  {
    label: 'واحدهای مجتمع',
    detail: 'ظرفیت و وضعیت بهره‌برداری',
    href: '/org-units',
    icon: Building2,
  },
  {
    label: 'قراردادهای جاری',
    detail: 'تمدیدها و سررسیدهای نزدیک',
    href: '/contracts',
    icon: FileText,
  },
  {
    label: 'شارژ و مطالبات',
    detail: 'مانده حساب و پرداخت‌های معوق',
    href: '/finance/charges',
    icon: HandCoins,
  },
  {
    label: 'درخواست‌های نگهداری',
    detail: 'خرابی‌ها و کارهای در جریان',
    href: '/operations/work-orders',
    icon: Wrench,
  },
];

const quickLinks = [
  { label: 'واحدهای مجتمع', href: '/org-units', icon: Building2 },
  { label: 'مالکان و مستأجران', href: '/owners-tenants', icon: Activity },
  { label: 'پارکینگ', href: '/operations/parking', icon: CarFront },
  {
    label: 'تقویم قراردادها',
    href: '/contracts/renewals',
    icon: CalendarClock,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-3xl">
          <AppBadge variant="warning" dot>
            در انتظار اتصال داده‌های مجتمع
          </AppBadge>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">
            نمای کلی مجتمع
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            وضعیت واحدها، قراردادها، امور مالی و نگهداری را از یک فضای کاری
            دنبال کنید.
          </p>
        </div>
        <AppLink href="/org-units" variant="primary" className="gap-2">
          <Building2 className="size-4" aria-hidden="true" />
          مشاهده واحدها
        </AppLink>
      </header>

      <section aria-labelledby="overview-heading" className="space-y-4">
        <div>
          <h2 id="overview-heading" className="text-lg font-semibold">
            شاخص‌های مجتمع
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            پس از اتصال اطلاعات عملیاتی، مقدارهای به‌روز در این بخش نمایش داده
            می‌شوند.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, detail, href, icon: Icon }) => (
            <AppLink
              key={label}
              href={href}
              variant="unstyled"
              className="group block rounded-xl"
            >
              <AppCard className="h-full transition-colors group-hover:bg-muted">
                <AppCardContent className="flex h-full min-h-36 flex-col p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <AppBadge>بدون داده</AppBadge>
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    —
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {detail}
                  </p>
                </AppCardContent>
              </AppCard>
            </AppLink>
          ))}
        </div>
      </section>

      <section aria-labelledby="quick-links-heading" className="space-y-4">
        <div>
          <h2 id="quick-links-heading" className="text-lg font-semibold">
            دسترسی سریع
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            رفتن مستقیم به بخش‌های پرتردد سامانه.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <AppLink
              key={href}
              href={href}
              variant="secondary"
              className="gap-2"
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </AppLink>
          ))}
        </div>
      </section>

      <section
        aria-label="وضعیت فعالیت‌های مجتمع"
        className="grid border-y border-border md:grid-cols-2"
      >
        <div className="min-w-0 py-5 md:border-e md:border-border md:pe-6">
          <h2 className="font-semibold">فعالیت‌های اخیر</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            رویدادها پس از راه‌اندازی گردش کار و ثبت عملیات مجتمع در این قسمت
            نمایش داده می‌شوند.
          </p>
          <AppBadge className="mt-3">هنوز فعالیتی متصل نیست</AppBadge>
        </div>
        <div className="min-w-0 border-t border-border py-5 md:border-t-0 md:ps-6">
          <h2 className="font-semibold">موارد نیازمند پیگیری</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            سررسید قراردادها، مطالبات و درخواست‌های تعمیراتی پس از اتصال داده‌ها
            در این قسمت جمع‌بندی می‌شوند.
          </p>
          <AppBadge variant="info" className="mt-3">
            آماده‌ی اتصال به داده‌ها
          </AppBadge>
        </div>
      </section>
    </div>
  );
}
