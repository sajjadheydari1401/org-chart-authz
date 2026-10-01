import {
  Building2,
  LayoutDashboard,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

import { AppLink } from '@/components/common/ui/app-link';
import { AppCard } from '@/components/common/ui/card/app-card';
import { AppCardContent } from '@/components/common/ui/card/app-card-content';

const currentAreas: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    title: 'واحدهای مجتمع',
    description: 'مشاهده و مدیریت ساختار واحدها و رابطه‌ی آن‌ها با مجموعه.',
    href: '/org-units',
    icon: Building2,
  },
  {
    title: 'کاربران',
    description: 'دسترسی به فهرست کاربران و مدیران مجموعه.',
    href: '/users',
    icon: UsersRound,
  },
  {
    title: 'نمای کلی سامانه',
    description: 'ورود به داشبورد و مشاهده‌ی چارت ساختار موجود.',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
];

export function HomeCurrentAreas() {
  return (
    <section aria-labelledby="current-areas-heading" className="py-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="current-areas-heading"
            className="text-xl font-semibold text-foreground"
          >
            دسترسی سریع
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            بخش‌های در دسترس فضای کاری
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {currentAreas.map((area) => {
          const Icon = area.icon;

          return (
            <AppLink
              key={area.href}
              href={area.href}
              variant="unstyled"
              className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <AppCard className="h-full transition-colors group-hover:bg-muted">
                <AppCardContent className="flex h-full min-h-40 flex-col p-5">
                  <span className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-semibold text-foreground">
                    {area.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                    {area.description}
                  </p>
                  <span className="mt-4 text-sm font-medium text-primary">
                    ورود به بخش <span aria-hidden="true">←</span>
                  </span>
                </AppCardContent>
              </AppCard>
            </AppLink>
          );
        })}
      </div>
    </section>
  );
}
