import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { AppFormError } from "./app-form-error";

export interface AppFormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

/**
 * Match htmlFor to the child control's id. Errors replace hints.
 * Pass required/invalid to the control separately; this wrapper does not modify children.
 */
export function AppFormField({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  children,
  className,
  ...props
}: AppFormFieldProps) {
  return (
    <div {...props} className={cn("min-w-0 space-y-2", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground [overflow-wrap:anywhere]">
        {label}
        {required && <span className="ms-1 text-destructive">*</span>}
      </label>
      {children}
      {error ? (
        <AppFormError message={error} />
      ) : hint ? (
        <p className="text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">{hint}</p>
      ) : null}
    </div>
  );
}
