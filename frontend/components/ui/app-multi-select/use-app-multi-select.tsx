import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import type { AppSelectOption } from "../app-select";

interface UseAppMultiSelectProps {
  id?: string;
  options: readonly AppSelectOption[];
  value: string[];
  disabled: boolean;
  onChange: (value: string[]) => void;
  onBlur?: () => void;
}

// Navigate only visible, enabled options. Wrap when reaching either end.
function moveOptionFocus(panel: HTMLDivElement, backwards: boolean) {
  const inputs = Array.from(
    panel.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:not(:disabled)'),
  );
  if (!inputs.length) return;

  const current = inputs.indexOf(document.activeElement as HTMLInputElement);
  let next = current + (backwards ? -1 : 1);
  if (next < 0) next = inputs.length - 1;
  if (next >= inputs.length) next = 0;
  inputs[next].focus();
}

/** Keeps selection controlled by the caller; only search and open state are local. */
export function useAppMultiSelect({
  id, options, value, disabled, onChange, onBlur,
}: UseAppMultiSelectProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const expanded = open && !disabled;

  const selected = new Set(value);
  const search = query.trim().toLocaleLowerCase();
  const filtered = options.filter((option) =>
    option.label.toLocaleLowerCase().includes(search),
  );
  // Resolve selected values to their display labels.
  const selectedOptions = options.filter((option) => value.includes(option.value));

  useEffect(() => {
    if (!expanded) return;
    searchRef.current?.focus();

    function handleOutsideClick(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, [expanded]);

  function toggle(option: AppSelectOption) {
    if (disabled || option.disabled) return;

    if (selected.has(option.value)) {
      onChange(value.filter((item) => item !== option.value));
    } else {
      onChange([...value, option.value]);
    }
  }

  function togglePanel() {
    setQuery("");
    setOpen(!expanded);
  }

  function handleTriggerKeys(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    setQuery("");
    setOpen(true);
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    // Internal focus changes don't close the field or mark it touched.
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setOpen(false);
    onBlur?.();
  }

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        break;
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        moveOptionFocus(event.currentTarget, event.key === "ArrowUp");
        break;
    }
  }

  return {
    controlId,
    panelId: `${controlId}-panel`,
    rootRef,
    searchRef,
    query,
    setQuery,
    expanded,
    selected,
    selectedOptions,
    filtered,
    toggle,
    togglePanel,
    handleTriggerKeys,
    handleBlur,
    handleKeys,
  };
}
