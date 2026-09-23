import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

export function AppSpinner({
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<"span">, "children">) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}
