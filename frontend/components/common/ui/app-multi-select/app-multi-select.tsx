"use client";

import { cn } from "@/lib/cn";
import type { AppSelectOption } from "../app-select";
import { AppMultiSelectTrigger } from "./app-multi-select-trigger";
import { AppMultiSelectTags } from "./app-multi-select-tags";
import { AppMultiSelectPanel } from "./app-multi-select-panel";
import { useAppMultiSelect } from "./use-app-multi-select";

export interface AppMultiSelectProps {
  options: readonly AppSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}

/**
 * Controlled selection; connect value/onChange/onBlur with React Hook Form Controller.
 * Load options before selection and start with an empty value array.
 * Use unique option values and match id to a label's htmlFor.
 */
export function AppMultiSelect({
  options, value, onChange, onBlur, id,
  placeholder = "Select options", disabled = false, invalid = false, className,
}: AppMultiSelectProps) {
  const {
    controlId, panelId, rootRef, searchRef, query, setQuery,
    expanded, selected, selectedOptions, filtered, toggle,
    togglePanel, handleTriggerKeys, handleBlur, handleKeys,
  } = useAppMultiSelect({ id, options, value, disabled, onChange, onBlur });

  return (
    <div ref={rootRef} onBlur={handleBlur} className={cn("relative min-w-0 w-full", className)}>
      <AppMultiSelectTrigger
        id={controlId}
        aria-controls={expanded ? panelId : undefined}
        expanded={expanded}
        disabled={disabled}
        invalid={invalid}
        onClick={togglePanel}
        onKeyDown={handleTriggerKeys}
      >
        {value.length ? `${value.length} selected` : placeholder}
      </AppMultiSelectTrigger>
      <AppMultiSelectTags options={selectedOptions} disabled={disabled} onRemove={toggle} />
      {expanded && (
        <AppMultiSelectPanel
          id={panelId}
          searchRef={searchRef}
          query={query}
          onSearch={setQuery}
          options={filtered}
          selected={selected}
          emptyMessage={options.length ? "No matching options." : "No options available."}
          onToggle={toggle}
          onKeyDown={handleKeys}
        />
      )}
    </div>
  );
}
