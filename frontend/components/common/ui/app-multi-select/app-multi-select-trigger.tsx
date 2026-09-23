import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface AppMultiSelectTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  expanded: boolean;
  invalid: boolean;
}

/** Renders the trigger; opening and keyboard behavior stay in the parent hook. */
export function AppMultiSelectTrigger({
  expanded,
  invalid,
  className,
  children,
  ...props
}: AppMultiSelectTriggerProps) {
  return (
    <button
      {...props}
      type="button"
      aria-expanded={expanded}
      className={cn(
        "flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-input bg-surface px-3 py-2 text-left text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
        invalid && "border-destructive",
        className,
      )}
    >
      <span className="min-w-0 break-words">{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "size-2 shrink-0 rotate-45 border-b-2 border-r-2",
          expanded && "rotate-225",
        )}
      />
    </button>
  );
}
