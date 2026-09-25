import { cn } from "@/lib/cn";
import { AppCheckbox } from "../app-checkbox";
import { AppTableProps, AppTableRowKey } from "./app-table";

type AppTableBodyProps<Row, Key extends AppTableRowKey> = Pick<
  AppTableProps<Row, Key>,
  "columns" | "data" | "rowKey" | "rowLabel" | "emptyMessage"
> & {
  selection?: { keys: ReadonlySet<Key>; onToggle: (key: Key) => void };
};

export function AppTableBody<Row, Key extends AppTableRowKey>({
  columns,
  data,
  rowKey,
  rowLabel,
  emptyMessage,
  selection,
}: AppTableBodyProps<Row, Key>) {
  return (
    <tbody className="divide-y divide-border">
      {data.length === 0 ? (
        <tr>
          <td
            colSpan={Math.max(1, columns.length + (selection ? 1 : 0))}
            className="px-4 py-8 text-center text-sm text-muted-foreground"
          >
            {emptyMessage}
          </td>
        </tr>
      ) : (
        data.map((row) => {
          const key = rowKey(row);
          const selected = selection?.keys.has(key) ?? false;

          return (
            <tr
              key={key}
              className={cn(
                "text-sm text-foreground",
                selected ? "bg-accent" : "hover:bg-muted",
              )}
            >
              {selection && (
                <td className="px-2 py-1">
                  <label className="flex min-h-11 min-w-11 items-center justify-center">
                    <AppCheckbox
                      aria-label={`Select ${rowLabel?.(row) ?? String(key)}`}
                      checked={selected}
                      onChange={() => selection.onToggle(key)}
                    />
                  </label>
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-start align-middle",
                    column.className,
                  )}
                >
                  {column.render
                    ? column.render(row)
                    : String(row[column.key as keyof Row] ?? "")}
                </td>
              ))}
            </tr>
          );
        })
      )}
    </tbody>
  );
}
