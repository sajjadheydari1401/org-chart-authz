import type { ReactNode } from 'react';

import { AppButton } from '../app-button';

interface AppTableActionsProps {
  title: string;
  onClick: () => void;
  icon: ReactNode;
}

export function AppTableActions({
  title,
  onClick,
  icon,
}: AppTableActionsProps) {
  return (
    <AppButton type="button" startIcon={icon} onClick={onClick}>
      {title}
    </AppButton>
  );
}
