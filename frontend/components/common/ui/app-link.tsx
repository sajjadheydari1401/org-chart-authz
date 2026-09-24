import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

const linkVariantStyles = {
  unstyled: "",

  default:
    "rounded-sm text-primary hover:text-primary-hover active:text-primary-active",

  nav: "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground active:bg-accent active:text-accent-foreground",

  primary:
    "inline-flex min-h-11 items-center justify-center rounded-lg border border-primary bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:border-primary-hover hover:bg-primary-hover active:border-primary-active active:bg-primary-active",

  secondary:
    "inline-flex min-h-11 items-center justify-center rounded-lg border border-input bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted active:bg-accent active:text-accent-foreground",
} as const;

export type AppLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
    variant?: keyof typeof linkVariantStyles;
  };

export function AppLink({
  variant = "default",
  className,
  children,
  ...props
}: AppLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        linkVariantStyles[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
