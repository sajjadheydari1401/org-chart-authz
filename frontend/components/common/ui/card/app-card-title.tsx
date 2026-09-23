import { cn } from "@/lib/cn";
import { HTMLAttributes, ReactNode } from "react";

export interface AppCardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function AppCardTitle({
  children,
  className,
  ...props
}: AppCardTitleProps) {
  return (
    <h3
      {...props}
      className={cn(
        "font-semibold leading-none tracking-tight text-foreground",
        className,
      )}
    >
      {children}
    </h3>
  );
}
