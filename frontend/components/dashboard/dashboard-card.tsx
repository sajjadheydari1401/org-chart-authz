import Link from "next/link";
import { AppCard } from "../common/ui/card/app-card";
import { AppCardContent } from "../common/ui/card/app-card-content";

export interface DashboardCardProps {
  href: string;
  title: string;
  description: string;
}

export function DashboardCard({
  href,
  title,
  description,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <AppCard className="h-full transition-colors group-hover:bg-muted">
        <AppCardContent className="flex h-full flex-col">
          <div
            aria-hidden="true"
            className="mb-4 flex size-9 items-center justify-center rounded-lg bg-accent"
          >
            <span className="size-2 rounded-full bg-accent-foreground" />
          </div>

          <h3 className="font-semibold text-foreground">{title}</h3>

          <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>

          <p className="mt-4 text-sm font-medium text-primary group-hover:text-primary-hover">
            Open
            <span aria-hidden="true"> →</span>
          </p>
        </AppCardContent>
      </AppCard>
    </Link>
  );
}
