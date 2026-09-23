import { cn } from "@/lib/cn";
import { HTMLAttributes, ReactNode } from "react";

export interface AppCardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function AppCardDescription({
  children,
  className,
  ...props
}: AppCardDescriptionProps) {
  return (
    <p
      {...props}
      className={cn(
        "text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]",
        className,
      )}
    >
      {children}
    </p>
  );
}
