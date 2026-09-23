import type { Ref, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface AppTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>;
  invalid?: boolean;
}

/**
 * Forwards native props and ref for React Hook Form registration.
 * Non-resizable by default; use className="resize-y" to allow vertical resizing.
 * Provide an associated label. Validation is owned by the caller.
 */
export function AppTextarea({
  className,
  rows = 4,
  invalid = false,
  ...props
}: AppTextareaProps) {
  return (
    <textarea
      {...props}
      rows={rows}
      className={cn(
        "block min-h-11 w-full min-w-0 max-w-full resize-none rounded-lg border border-input bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-transparent disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground read-only:bg-muted",
        invalid && "border-destructive",
        className,
      )}
    />
  );
}
