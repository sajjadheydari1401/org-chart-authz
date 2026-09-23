import type { AppSelectOption } from "../app-select";

interface AppMultiSelectTagsProps {
  options: AppSelectOption[];
  disabled: boolean;
  onRemove: (option: AppSelectOption) => void;
}

/** Only renders selected options; lookup and removal logic stay in the hook. */
export function AppMultiSelectTags({ options, disabled, onRemove }: AppMultiSelectTagsProps) {
  if (!options.length) return null;

  return (
    <ul className="mt-2 flex flex-wrap gap-2">
      {options.map((option) => (
        <li key={option.value} className="flex min-w-0 max-w-full items-center rounded-lg bg-accent ps-3 text-sm text-accent-foreground">
          <span className="min-w-0 [overflow-wrap:anywhere]">{option.label}</span>
          <button
            type="button"
            disabled={disabled || option.disabled}
            aria-label={`Remove ${option.label}`}
            onClick={() => onRemove(option)}
            className="min-h-11 min-w-11 shrink-0 cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
