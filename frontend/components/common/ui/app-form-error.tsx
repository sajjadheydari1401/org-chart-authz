import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface AppFormErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

/** Accepts a validation message, including React Hook Form's error.message. */
export function AppFormError({ message, className, ...props }: AppFormErrorProps) {
  if (!message) return null;

  return (
    <p {...props} className={cn("text-sm leading-6 text-destructive [overflow-wrap:anywhere]", className)}>
      {message}
    </p>
  );
}
