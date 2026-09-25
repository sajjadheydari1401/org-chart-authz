import { AppCard } from "../common/ui/card/app-card";
import { AppCardContent } from "../common/ui/card/app-card-content";
import { AppLink } from "../common/ui/app-link";

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
    <AppLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variant="unstyled"
      className="group block rounded-xl"
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
            مشاهده
            <span aria-hidden="true"> →</span>
          </p>
        </AppCardContent>
      </AppCard>
    </AppLink>
  );
}
