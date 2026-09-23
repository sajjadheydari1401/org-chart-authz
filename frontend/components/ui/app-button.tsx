import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { AppSpinner } from "./app-spinner";

const buttonBaseStyles =
  "relative inline-flex min-h-11 min-w-11 max-w-full cursor-pointer items-center justify-center gap-2 rounded-lg border font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground";

const buttonVariantStyles = {
  primary:
    "border-primary bg-primary text-primary-foreground enabled:hover:border-primary-hover enabled:hover:bg-primary-hover enabled:active:border-primary-active enabled:active:bg-primary-active",
  secondary:
    "border-input bg-surface text-foreground enabled:hover:bg-muted enabled:active:bg-accent",
  destructive:
    "border-destructive bg-surface text-destructive enabled:hover:bg-destructive-subtle enabled:active:bg-destructive enabled:active:text-primary-foreground",
  ghost:
    "border-transparent bg-transparent text-foreground enabled:hover:bg-muted enabled:active:bg-accent",
} as const;


const buttonSizeStyles = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "min-h-12 px-5 py-3 text-base",
} as const;

export type AppButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: keyof typeof buttonVariantStyles;
  size?: keyof typeof buttonSizeStyles;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export function AppButton({
  variant = "primary",
  size = "md",
  loading = false,
  startIcon,
  endIcon,
  className,
  children,
  disabled,
  type = "submit",
  "aria-busy": ariaBusy,
  ...props
}: AppButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || ariaBusy}
      className={cn(
        buttonBaseStyles,
        buttonVariantStyles[variant],
        buttonSizeStyles[size],
        className,
      )}
    >
      {loading && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <AppSpinner />
        </span>
      )}
      <span className={cn("inline-flex min-w-0 items-center justify-center gap-2", loading && "opacity-0")}>
        {startIcon && <span aria-hidden="true" className="inline-flex shrink-0 [&>svg]:size-4">{startIcon}</span>}
        {children != null && <span className="min-w-0 whitespace-normal [overflow-wrap:anywhere]">{children}</span>}
        {endIcon && <span aria-hidden="true" className="inline-flex shrink-0 [&>svg]:size-4">{endIcon}</span>}
      </span>
    </button>
  );
}
