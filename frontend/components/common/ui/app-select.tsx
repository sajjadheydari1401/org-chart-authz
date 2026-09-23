import type { Ref, SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface AppSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface AppSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "multiple"> {
  ref?: Ref<HTMLSelectElement>;
  options: readonly AppSelectOption[];
  placeholder?: string;
  invalid?: boolean;
}

/**
 * Native single selection; pass register() props directly for React Hook Form.
 */
export function AppSelect({
  options,
  placeholder,
  invalid = false,
  className,
  value,
  defaultValue,
  ...props
}: AppSelectProps) {
  return (
    <select
      {...props}
      value={value}
      defaultValue={value === undefined ? (defaultValue ?? (placeholder !== undefined ? "" : undefined)) : undefined}
      className={cn(
        "block min-h-11 w-full min-w-0 max-w-full cursor-pointer rounded-lg border border-input bg-surface px-3 py-2 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-transparent disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
        invalid && "border-destructive",
        className,
      )}
    >
      {placeholder !== undefined && <option value="" disabled>{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
