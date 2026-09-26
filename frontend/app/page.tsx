import { FeatureCard } from "@/components/common/feature-card";
import { AppLink } from "@/components/common/ui/app-link";
import { AppCard } from "@/components/common/ui/card/app-card";
import { AppCardContent } from "@/components/common/ui/card/app-card-content";
import { AppCardHeader } from "@/components/common/ui/card/app-card-header";
import { AppCardTitle } from "@/components/common/ui/card/app-card-title";
import { getAccessToken } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6">
        <header className="flex min-h-20 flex-wrap items-center justify-between gap-4 border-b border-border py-4">
          <AppLink href="/" className="text-lg font-semibold tracking-tight">
            چارت سازمانی سیمرغ
          </AppLink>

          <nav aria-label="ناوبری اصلی" className="flex items-center gap-2">
            <AppLink href="/dashboard" variant="primary">
              داشبورد
            </AppLink>
          </nav>
        </header>

        <section className="flex flex-1 items-center py-16 sm:py-24">
          <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.75fr)] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">مدیریت سازمان</p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                سازمان شما،
                <span className="block text-muted-foreground">
                  با ساختاری روشن و منظم.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                کاربران، روابط سازمانی، نقش‌ها و مجوزها را در یک فضای کاری امن
                مدیریت کنید.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <AppLink href="/dashboard" variant="primary">
                  ورود به داشبورد
                </AppLink>
              </div>
            </div>

            <AppCard className="rounded-2xl">
              <AppCardHeader>
                <p className="text-sm font-medium text-muted-foreground">
                  فضای کاری
                </p>

                <AppCardTitle className="text-xl">
                  همه‌چیز در یک مکان
                </AppCardTitle>
              </AppCardHeader>

              <AppCardContent className="space-y-3">
                <FeatureCard
                  title="چارت سازمانی"
                  description="روابط سازمانی و ساختار تیم‌ها را به‌روشنی ببینید."
                />

                <FeatureCard
                  title="کاربران"
                  description="کاربران سازمان خود را مدیریت کنید."
                />

                <FeatureCard
                  title="نقش‌ها و مجوزها"
                  description="دسترسی به سامانه را با نقش‌ها و مجوزها کنترل کنید."
                />

                <FeatureCard
                  title="دسترسی امن"
                  description="با رمز عبور و تأیید پیامکی از حساب‌های کاربری محافظت کنید."
                />
              </AppCardContent>
            </AppCard>
          </div>
        </section>

        <footer className="border-t border-border py-6">
          <p className="text-sm text-muted-foreground">چارت سازمانی سیمرغ</p>
        </footer>
      </div>
    </main>
  );
}
