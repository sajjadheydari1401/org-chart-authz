import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

const badgeVariantStyles = {
  neutral: {
    badge: 'border-border bg-muted text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
  primary: {
    badge: 'border-accent bg-accent text-accent-foreground',
    dot: 'bg-accent-foreground',
  },
  success: {
    badge: 'border-success/20 bg-success-subtle text-success',
    dot: 'bg-success',
  },
  warning: {
    badge: 'border-warning/20 bg-warning-subtle text-warning',
    dot: 'bg-warning',
  },
  destructive: {
    badge: 'border-destructive/20 bg-destructive-subtle text-destructive',
    dot: 'bg-destructive',
  },
  info: {
    badge: 'border-info/20 bg-info-subtle text-info',
    dot: 'bg-info',
  },
} as const;

const badgeSizeStyles = {
  sm: 'min-h-6 px-2 py-0.5 text-xs',
  md: 'min-h-7 px-2.5 py-1 text-sm',
} as const;

export interface AppBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariantStyles;
  size?: keyof typeof badgeSizeStyles;
  dot?: boolean;
}

export function AppBadge({
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className,
  children,
  ...props
}: AppBadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full border font-medium [overflow-wrap:anywhere]',
        badgeVariantStyles[variant].badge,
        badgeSizeStyles[size],
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn(
            'size-1.5 shrink-0 rounded-full',
            badgeVariantStyles[variant].dot,
          )}
        />
      )}
      {children}
    </span>
  );
}
