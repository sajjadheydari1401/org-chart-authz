import {
  Building2,
  CarFront,
  FileText,
  FolderArchive,
  HandCoins,
  LayoutDashboard,
  UsersRound,
  Wrench,
} from "lucide-react";

import { AppBadge } from "@/components/common/ui/app-badge";
import { AppLink } from "@/components/common/ui/app-link";
import { AppCard } from "@/components/common/ui/card/app-card";
import { AppCardContent } from "@/components/common/ui/card/app-card-content";

const currentAreas = [
  {
    title: "واحدهای مجتمع",
    description: "مشاهده و مدیریت ساختار واحدها و رابطه‌ی آن‌ها با مجموعه.",
    href: "/org-units",
    icon: <Building2 className="size-5" aria-hidden="true" />,
  },
  {
    title: "کاربران",
    description: "دسترسی به فهرست کاربران و مدیران مجموعه.",
    href: "/users",
    icon: <UsersRound className="size-5" aria-hidden="true" />,
  },
  {
    title: "نمای کلی سامانه",
    description: "ورود به داشبورد و مشاهده‌ی چارت ساختار موجود.",
    href: "/dashboard",
    icon: <LayoutDashboard className="size-5" aria-hidden="true" />,
  },
];

const plannedAreas = [
  {
    title: "قراردادها و اجاره",
    icon: <FileText className="size-4" aria-hidden="true" />,
  },
  {
    title: "درآمد، هزینه و شارژ",
    icon: <HandCoins className="size-4" aria-hidden="true" />,
  },
  {
    title: "پارکینگ",
    icon: <CarFront className="size-4" aria-hidden="true" />,
  },
  {
    title: "تأسیسات و تعمیرات",
    icon: <Wrench className="size-4" aria-hidden="true" />,
  },
  {
    title: "بایگانی اسناد",
    icon: <FolderArchive className="size-4" aria-hidden="true" />,
  },
];

export default async function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <AppLink href="/" className="font-semibold tracking-tight">
            مدیریت مجتمع تجاری
          </AppLink>
          <nav
            aria-label="ناوبری اصلی"
            className="flex flex-wrap items-center gap-2"
          >
            <AppLink href="/dashboard" variant="nav">
              داشبورد
            </AppLink>
            <AppLink href="/org-units" variant="nav">
              واحدها
            </AppLink>
            <AppLink href="/users" variant="nav">
              کاربران
            </AppLink>
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
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
                کنید. این سامانه برای پیوند دادن امور ملکی، قراردادی و مالی
                مجتمع طراحی می‌شود.
              </p>
            </div>
            <AppLink href="/dashboard" variant="primary" className="gap-2">
              ورود به داشبورد
              <LayoutDashboard className="size-4" aria-hidden="true" />
            </AppLink>
          </div>
        </section>

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
            {currentAreas.map((area) => (
              <AppLink
                key={area.href}
                href={area.href}
                variant="unstyled"
                className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <AppCard className="h-full transition-colors group-hover:bg-muted">
                  <AppCardContent className="flex h-full min-h-40 flex-col p-5">
                    <span className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      {area.icon}
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
            ))}
          </div>
        </section>

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
            {plannedAreas.map((area) => (
              <li
                key={area.title}
                className="flex min-h-12 min-w-0 items-center justify-between gap-3 border-b border-border py-2"
              >
                <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                  <span className="shrink-0 text-muted-foreground">
                    {area.icon}
                  </span>
                  <span className="[overflow-wrap:anywhere]">{area.title}</span>
                </span>
                <AppBadge className="shrink-0">در نقشه‌ی سامانه</AppBadge>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
