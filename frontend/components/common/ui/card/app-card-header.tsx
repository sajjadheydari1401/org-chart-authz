import { cn } from "@/lib/cn";
import { HTMLAttributes, ReactNode } from "react";

export interface AppCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function AppCardHeader({
  children,
  className,
  ...props
}: AppCardHeaderProps) {
  return (
    <div {...props} className={cn("space-y-1.5 px-5 pt-5", className)}>
      {children}
    </div>
  );
}
