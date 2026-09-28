'use client';

import type { ReactNode } from 'react';

import { AppButton } from './app-button';
import { AppDialog, type AppDialogProps } from './app-dialog';

export interface AppConfirmDialogProps extends Omit<
  AppDialogProps,
  'children' | 'footer'
> {
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'destructive';
  confirming?: boolean;
  onConfirm: () => void;
  children?: ReactNode;
}

export function AppConfirmDialog({
  confirmLabel = 'تأیید',
  cancelLabel = 'انصراف',
  confirmVariant = 'destructive',
  confirming = false,
  onConfirm,
  onOpenChange,
  children,
  ...dialogProps
}: AppConfirmDialogProps) {
  return (
    <AppDialog
      {...dialogProps}
      onOpenChange={onOpenChange}
      dismissible={!confirming && dialogProps.dismissible !== false}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <AppButton
            type="button"
            variant="secondary"
            disabled={confirming}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </AppButton>
          <AppButton
            type="button"
            variant={confirmVariant}
            loading={confirming}
            onClick={onConfirm}
          >
            {confirmLabel}
          </AppButton>
        </div>
      }
    >
      {children}
    </AppDialog>
  );
}
