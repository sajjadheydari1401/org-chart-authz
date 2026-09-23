import type { InputHTMLAttributes, Ref } from "react";

import { cn } from "@/lib/cn";

export interface AppCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  ref?: Ref<HTMLInputElement>;
}

/**
 * Supports checked/defaultChecked and React Hook Form's register() props.
 */
export function AppCheckbox({
  className,
  ...props
}: AppCheckboxProps) {
  return (
    <input
      {...props}
      type="checkbox"
      className={cn(
        "size-5 shrink-0 cursor-pointer rounded accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:accent-muted-foreground",
        className,
      )}
    />
  );
}
