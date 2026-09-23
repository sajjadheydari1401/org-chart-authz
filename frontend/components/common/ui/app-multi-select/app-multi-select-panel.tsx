import type { KeyboardEvent, RefObject } from "react";
import { cn } from "@/lib/cn";
import { AppCheckbox } from "../app-checkbox";
import type { AppSelectOption } from "../app-select";

interface AppMultiSelectPanelProps {
  id: string;
  searchRef: RefObject<HTMLInputElement | null>;
  query: string;
  onSearch: (query: string) => void;
  options: readonly AppSelectOption[];
  selected: Set<string>;
  emptyMessage: string;
  onToggle: (option: AppSelectOption) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}

/** Renders search results. Selection and navigation are handled by the hook. */
export function AppMultiSelectPanel({
  id, searchRef, query, onSearch, options, selected, emptyMessage, onToggle, onKeyDown,
}: AppMultiSelectPanelProps) {
  return (
    <div id={id} onKeyDown={onKeyDown} className="absolute start-0 z-20 mt-2 w-full min-w-0 rounded-xl border border-border bg-surface p-2 shadow-lg">
      <input
        ref={searchRef}
        type="search"
        value={query}
        onChange={(event) => onSearch(event.target.value)}
        onKeyDown={(event) => {
          // Searching must not submit the surrounding form.
          if (event.key === "Enter") event.preventDefault();
        }}
        aria-label="Search options"
        placeholder="Search options…"
        className="min-h-11 w-full min-w-0 rounded-lg border border-input bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-primary"
      />
      <div className="mt-2 max-h-60 overflow-y-auto overscroll-contain">
        {options.map((option) => (
          <label
            key={option.value}
            onMouseDown={(event) => {
              // Keep focus inside the panel until the label activates its checkbox.
              event.preventDefault();
            }}
            className={cn(
              "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-sm",
              option.disabled ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer hover:bg-muted",
              selected.has(option.value) && "bg-accent",
            )}
          >
            <AppCheckbox checked={selected.has(option.value)} disabled={option.disabled} onChange={() => onToggle(option)} />
            <span className="min-w-0 [overflow-wrap:anywhere]">{option.label}</span>
          </label>
        ))}
        {!options.length && <p className="px-3 py-4 text-sm text-muted-foreground">{emptyMessage}</p>}
      </div>
    </div>
  );
}
