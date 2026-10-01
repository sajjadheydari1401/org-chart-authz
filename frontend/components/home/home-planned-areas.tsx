import {
  CarFront,
  FileText,
  FolderArchive,
  HandCoins,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

import { AppBadge } from '@/components/common/ui/app-badge';

const plannedAreas: { title: string; icon: LucideIcon }[] = [
  { title: 'قراردادها و اجاره', icon: FileText },
  { title: 'درآمد، هزینه و شارژ', icon: HandCoins },
  { title: 'پارکینگ', icon: CarFront },
  { title: 'تأسیسات و تعمیرات', icon: Wrench },
  { title: 'بایگانی اسناد', icon: FolderArchive },
];

export function HomePlannedAreas() {
  return (
    <section
      aria-labelledby="planned-areas-heading"
      className="border-t border-border py-8"
    >
      <div className="mb-5">
        <h2
          id="planned-areas-heading"
          className="text-xl font-semibold text-foreground"
        >
          دامنه‌ی سامانه
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          حوزه‌هایی که در طرح یکپارچه‌ی مدیریت مجتمع تعریف شده‌اند.
        </p>
      </div>
      <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {plannedAreas.map((area) => {
          const Icon = area.icon;

          return (
            <li
              key={area.title}
              className="flex min-h-12 min-w-0 items-center justify-between gap-3 border-b border-border py-2"
            >
              <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                <span className="shrink-0 text-muted-foreground">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="[overflow-wrap:anywhere]">{area.title}</span>
              </span>
              <AppBadge className="shrink-0">در نقشه‌ی سامانه</AppBadge>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
