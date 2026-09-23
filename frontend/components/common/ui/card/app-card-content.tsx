import { cn } from "@/lib/cn";
import { HTMLAttributes, ReactNode } from "react";

export interface AppCardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function AppCardContent({
  children,
  className,
  ...props
}: AppCardContentProps) {
  return (
    <div {...props} className={cn("px-5 py-5", className)}>
      {children}
    </div>
  );
}
