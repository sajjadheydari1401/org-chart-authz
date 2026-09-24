import type { InputHTMLAttributes, Ref } from "react";

import { cn } from "@/lib/cn";

export interface AppRadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface AppRadioGroupProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "children" | "checked" | "defaultChecked" | "value" | "defaultValue"
> {
  name: string;
  options: readonly AppRadioOption[];
  label?: string;
  value?: string;
  defaultValue?: string;
  orientation?: "vertical" | "horizontal";
  ref?: Ref<HTMLInputElement>;
}

/**
 * Use a unique name per group and unique option values. Labels toggle their radio.
 * Native onChange receives an event; the selected value is event.target.value.
 * Spread React Hook Form register() props to register each radio with the same ref.
 * className and id apply to the fieldset; remaining native props apply to each input.
 */
export function AppRadioGroup({
  options,
  name,
  label,
  value,
  defaultValue,
  orientation = "vertical",
  disabled = false,
  className,
  id,
  ref,
  ...props
}: AppRadioGroupProps) {
  return (
    <fieldset id={id} disabled={disabled} className={cn("min-w-0 space-y-2", className)}>
      {label && <legend className="text-sm font-medium text-foreground">{label}</legend>}
      <div className={cn("flex gap-x-6 gap-y-1", orientation === "horizontal" ? "flex-wrap" : "flex-col")}>
        {options.map((option) => {
          const isDisabled = disabled || option.disabled;

          return (
            <label
              key={option.value}
              className={cn(
                "flex min-h-11 min-w-0 items-center gap-3 py-2 text-sm",
                isDisabled ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer text-foreground",
              )}
            >
              <input
                {...props}
                ref={ref}
                type="radio"
                name={name}
                value={option.value}
                disabled={isDisabled}
                checked={value === undefined ? undefined : value === option.value}
                defaultChecked={value === undefined ? defaultValue === option.value : undefined}
                className="size-5 shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed"
              />
              <span className="min-w-0 [overflow-wrap:anywhere]">{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
