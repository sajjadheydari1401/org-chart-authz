'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/cn';
import { AppButton } from './app-button';

const dialogSizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
} as const;

export interface AppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: keyof typeof dialogSizeStyles;
  dismissible?: boolean;
  className?: string;
}

export function AppDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  dismissible = true,
  className,
}: AppDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        if (dismissible) onOpenChange(false);
      }}
      onClose={() => {
        if (open) onOpenChange(false);
      }}
      onClick={(event) => {
        if (dismissible && event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] border-0 bg-transparent p-0 text-foreground backdrop:bg-black/40 backdrop:backdrop-blur-[1px]"
    >
      <section
        className={cn(
          'mx-auto flex max-h-[calc(100dvh-2rem)] min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl',
          dialogSizeStyles[size],
          className,
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-semibold text-foreground">
              {title}
            </h2>
            {description && (
              <p
                id={descriptionId}
                className="mt-1 text-sm leading-6 text-muted-foreground"
              >
                {description}
              </p>
            )}
          </div>
          {dismissible && (
            <AppButton
              type="button"
              variant="ghost"
              size="sm"
              aria-label="بستن"
              title="بستن"
              onClick={() => onOpenChange(false)}
              className="shrink-0 px-2"
            >
              <X className="size-4" />
            </AppButton>
          )}
        </header>
        <div className="min-h-0 overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <footer className="border-t border-border px-5 py-4">{footer}</footer>
        )}
      </section>
    </dialog>
  );
}
