import type { ReactNode } from "react";
import { AppCard } from "./ui/card/app-card";
import { AppCardContent } from "./ui/card/app-card-content";

export interface InfoCardProps {
  title: string;
  children: ReactNode;
}

export function InfoCard({ title, children }: InfoCardProps) {
  return (
    <AppCard>
      <AppCardContent>
        <div className="flex items-start gap-4">
          <div
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-info-subtle text-info"
          >
            <span className="text-lg font-semibold">i</span>
          </div>

          <div className="min-w-0">
            <h2 className="font-semibold text-foreground">{title}</h2>

            <div className="mt-1 text-sm leading-6 text-muted-foreground">
              {children}
            </div>
          </div>
        </div>
      </AppCardContent>
    </AppCard>
  );
}
