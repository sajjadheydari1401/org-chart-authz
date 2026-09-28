import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { AppSelectOption } from '../app-select';

interface AppComboboxPanelProps {
  options: readonly AppSelectOption[];
  selectedValue: string;
  activeValue: string | null;
  emptyMessage: string;
  onSelect: (option: AppSelectOption) => void;
}

export function AppComboboxPanel({
  options,
  selectedValue,
  activeValue,
  emptyMessage,
  onSelect,
}: AppComboboxPanelProps) {
  return (
    <div className="absolute start-0 z-20 mt-2 max-h-60 w-full min-w-0 overflow-y-auto overscroll-contain rounded-xl border border-border bg-surface p-1.5 shadow-lg">
      {options.map((option) => {
        const selected = option.value === selectedValue;
        const active = option.value === activeValue;

        return (
          <div
            key={option.value}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(option)}
            className={cn(
              'flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm',
              option.disabled
                ? 'cursor-not-allowed text-muted-foreground'
                : 'cursor-pointer text-foreground',
              active && !option.disabled && 'bg-accent text-accent-foreground',
              selected && !active && 'bg-muted',
            )}
          >
            <span className="min-w-0 [overflow-wrap:anywhere]">
              {option.label}
            </span>
            {selected && <Check className="size-4 shrink-0" />}
          </div>
        );
      })}
      {!options.length && (
        <p className="px-3 py-4 text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      )}
    </div>
  );
}
