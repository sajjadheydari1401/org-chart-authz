import type { InputHTMLAttributes, Ref } from "react";

import { cn } from "@/lib/cn";

export interface AppSwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  ref?: Ref<HTMLInputElement>;
}

/**
 * Supports checked/defaultChecked and React Hook Form's register() props.
 */
export function AppSwitch({ className, ...props }: AppSwitchProps) {
  return (
    <input
      {...props}
      type="checkbox"
      role="switch"
      className={cn(
        "relative h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full bg-input transition-colors checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 after:absolute after:start-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-surface after:transition-transform after:content-[''] checked:after:translate-x-5 rtl:checked:after:-translate-x-5 motion-reduce:transition-none motion-reduce:after:transition-none forced-colors:appearance-auto forced-colors:after:hidden",
        className,
      )}
    />
  );
}
