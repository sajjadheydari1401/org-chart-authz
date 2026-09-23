import type { InputHTMLAttributes, Ref } from "react";

import { cn } from "@/lib/cn";

export interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
  invalid?: boolean;
}

/**
 * Pass React Hook Form's register() props directly: name, ref, onChange, and
 * onBlur are forwarded unchanged. Supports controlled and uncontrolled values.
 * Provide an associated label.
 */
export function AppInput({
  className,
  type = "text",
  invalid = false,
  ...props
}: AppInputProps) {
  return (
    <input
      {...props}
      type={type}
      className={cn(
        "block min-h-11 w-full min-w-0 rounded-lg border border-input bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-transparent disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground read-only:bg-muted",
        invalid && "border-destructive",
        className,
      )}
    />
  );
}
