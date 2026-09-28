import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';
import type { AppSelectOption } from '../app-select';

interface UseAppComboboxOptions {
  id?: string;
  options: readonly AppSelectOption[];
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export function useAppCombobox({
  id,
  options,
  value,
  disabled,
  onChange,
  onBlur,
}: UseAppComboboxOptions) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const expanded = open && !disabled;
  const selectedOption = options.find((option) => option.value === value);
  const search = query.trim().toLocaleLowerCase();
  const filteredOptions = options.filter((option) =>
    option.label.toLocaleLowerCase().includes(search),
  );
  const enabledOptions = filteredOptions.filter((option) => !option.disabled);
  const activeOption = enabledOptions[activeIndex] ?? null;

  useEffect(() => {
    if (!expanded) return;

    function handleOutsideClick(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('pointerdown', handleOutsideClick);
    return () =>
      document.removeEventListener('pointerdown', handleOutsideClick);
  }, [expanded]);

  function openPanel() {
    if (disabled) return;
    setQuery('');
    setActiveIndex(0);
    setOpen(true);
  }

  function selectOption(option: AppSelectOption) {
    if (disabled || option.disabled) return;
    onChange(option.value);
    setQuery('');
    setOpen(false);
  }

  function handleInputChange(nextQuery: string) {
    setQuery(nextQuery);
    setActiveIndex(0);
    setOpen(true);
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setOpen(false);
    setQuery('');
    onBlur?.();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        if (!expanded) {
          openPanel();
          setActiveIndex(
            event.key === 'ArrowDown'
              ? 0
              : Math.max(0, enabledOptions.length - 1),
          );
          return;
        }
        if (!enabledOptions.length) return;
        setActiveIndex((current) =>
          event.key === 'ArrowDown'
            ? (current + 1) % enabledOptions.length
            : (current - 1 + enabledOptions.length) % enabledOptions.length,
        );
        break;
      }
      case 'Enter':
        if (expanded && activeOption) {
          event.preventDefault();
          selectOption(activeOption);
        }
        break;
      case 'Escape':
        if (expanded) {
          event.preventDefault();
          setOpen(false);
          setQuery('');
        }
        break;
      case 'Tab':
        setOpen(false);
        setQuery('');
        break;
    }
  }

  return {
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
  };
}
