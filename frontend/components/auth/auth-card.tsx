import type { ReactNode } from "react";
import { AppCard } from "../common/ui/card/app-card";
import { AppCardContent } from "../common/ui/card/app-card-content";
import { AppCardDescription } from "../common/ui/card/app-card-description";
import { AppCardHeader } from "../common/ui/card/app-card-header";
import { AppCardTitle } from "../common/ui/card/app-card-title";

export interface AuthCardProps {
  eyebrow?: string;
  title: string;
  description: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <AppCard>
      <AppCardHeader>
        {eyebrow && (
          <p className="text-sm font-medium text-primary">{eyebrow}</p>
        )}

        <AppCardTitle className="text-2xl">{title}</AppCardTitle>

        <AppCardDescription>{description}</AppCardDescription>
      </AppCardHeader>

      <AppCardContent>{children}</AppCardContent>

      {footer && (
        <div className="border-t border-border px-5 py-4">{footer}</div>
      )}
    </AppCard>
  );
}
