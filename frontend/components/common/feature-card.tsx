import { AppCard } from "./ui/card/app-card";
import { AppCardContent } from "./ui/card/app-card-content";

export interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <AppCard className="bg-background">
      <AppCardContent className="p-4">
        <div className="flex gap-3">
          <div
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent"
          >
            <span className="size-2 rounded-full bg-accent-foreground" />
          </div>

          <div className="min-w-0">
            <h3 className="font-medium text-foreground">{title}</h3>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </AppCardContent>
    </AppCard>
  );
}
