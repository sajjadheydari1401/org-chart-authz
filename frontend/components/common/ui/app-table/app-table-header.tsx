import { AppCheckbox } from "../app-checkbox";
import { cn } from "@/lib/cn";
import { AppTableColumn } from "./app-table";

interface AppTableHeaderProps<Row> {
  columns: readonly AppTableColumn<Row>[];
  selection?: {
    allSelected: boolean;
    someSelected: boolean;
    disabled: boolean;
    onToggle: () => void;
  };
}

export function AppTableHeader<Row>({
  columns,
  selection,
}: AppTableHeaderProps<Row>) {
  return (
    <thead className="bg-muted text-foreground">
      <tr>
        {selection && (
          <th scope="col" className="w-14 px-2 py-1">
            <label className="flex min-h-11 min-w-11 items-center justify-center">
              <AppCheckbox
                aria-label="Select all rows"
                checked={selection.allSelected}
                disabled={selection.disabled}
                ref={(input) => {
                  if (input)
                    input.indeterminate =
                      selection.someSelected && !selection.allSelected;
                }}
                onChange={selection.onToggle}
              />
            </label>
          </th>
        )}
        {columns.map((column) => (
          <th
            key={column.key}
            scope="col"
            className={cn(
              "px-4 py-3 text-start text-sm font-medium",
              column.className,
            )}
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
