"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AppTableHeader } from "./app-table-header";
import { AppTableBody } from "./app-table-body";
import { useTableSelection } from "./use-table-selection";

export type AppTableRowKey = string | number;

export type AppTableColumn<Row> = {
  header: ReactNode;
  className?: string;
} &
  // A key that exists on the row can use the default renderer.
  (| {
        key: Extract<keyof Row, string>;
        render?: (row: Row) => ReactNode;
      }

    // A custom/computed key must provide its own renderer.
    | {
        key: string;
        render: (row: Row) => ReactNode;
      }
  );

export type AppTableProps<Row, Key extends AppTableRowKey> = {
  columns: readonly AppTableColumn<Row>[];
  data: readonly Row[];
  rowKey: (row: Row) => Key;
  rowLabel?: (row: Row) => string;
  caption?: string;
  emptyMessage?: ReactNode;
  className?: string;
  selectedKeys?: readonly Key[];
  onSelectionChange?: (keys: Key[]) => void;
};

export function AppTable<Row, Key extends AppTableRowKey>({
  columns,
  data,
  rowKey,
  rowLabel,
  caption,
  emptyMessage = "No results found.",
  className,
  selectedKeys,
  onSelectionChange,
}: AppTableProps<Row, Key>) {
  const selection = useTableSelection({
    data,
    rowKey,
    selectedKeys,
    onSelectionChange,
  });

  return (
    <div
      role="region"
      aria-label={caption ?? "Table"}
      tabIndex={0}
      className={cn(
        "w-full min-w-0 overflow-x-auto rounded-xl border border-border bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      )}
    >
      <table className="w-full border-collapse">
        {caption && (
          <caption className="px-4 py-3 text-start text-sm text-muted-foreground">
            {caption}
          </caption>
        )}

        <AppTableHeader columns={columns} selection={selection?.header} />

        <AppTableBody
          columns={columns}
          data={data}
          rowKey={rowKey}
          rowLabel={rowLabel}
          emptyMessage={emptyMessage}
          selection={selection?.body}
        />
      </table>
    </div>
  );
}
