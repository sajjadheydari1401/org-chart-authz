'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { AppSelectOption } from '../app-select';
import { AppComboboxPanel } from './app-combobox-panel';
import { useAppCombobox } from './use-app-combobox';

export interface AppComboboxProps {
  options: readonly AppSelectOption[];
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}

/** Controlled, searchable single selection; connect it with React Hook Form Controller. */
export function AppCombobox({
  options,
  value = '',
  onChange,
  onBlur,
  id,
  placeholder = 'Select an option',
  emptyMessage,
  disabled = false,
  invalid = false,
  className,
}: AppComboboxProps) {
  const {
    activeOption,
    controlId,
    expanded,
    filteredOptions,
    handleBlur,
    handleInputChange,
    handleKeyDown,
    openPanel,
    query,
    rootRef,
    selectOption,
    selectedOption,
  } = useAppCombobox({ id, options, value, disabled, onChange, onBlur });

  const noOptionsMessage =
    emptyMessage ??
    (options.length ? 'No matching options.' : 'No options available.');

  return (
    <div
      ref={rootRef}
      onBlur={handleBlur}
      className={cn('relative w-full min-w-0', className)}
    >
      <div className="relative">
        <input
          id={controlId}
          type="text"
          autoComplete="off"
          disabled={disabled}
          value={expanded ? query : (selectedOption?.label ?? '')}
          placeholder={placeholder}
          onFocus={openPanel}
          onClick={() => {
            if (!expanded) openPanel();
          }}
          onChange={(event) => handleInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'block min-h-11 w-full min-w-0 rounded-lg border border-input bg-surface px-3 py-2 pe-10 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground',
            invalid && 'border-destructive',
          )}
        />
        <ChevronDown
          className={cn(
            'pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-transform motion-reduce:transition-none',
            expanded && 'rotate-180',
          )}
        />
      </div>
      {expanded && (
        <AppComboboxPanel
          options={filteredOptions}
          selectedValue={value}
          activeValue={activeOption?.value ?? null}
          emptyMessage={noOptionsMessage}
          onSelect={selectOption}
        />
      )}
    </div>
  );
}
