import { logSelectedRows } from "@/utils/common";
import type { AppTableRowKey } from "./app-table";

type Options<Row, Key extends AppTableRowKey> = {
  data: readonly Row[];
  rowKey: (row: Row) => Key;
  selectedKeys?: readonly Key[];
  onSelectionChange?: (keys: Key[]) => void;
};

/**
 * Manages controlled row selection for AppTable.
 *
 * Returns selection props for the table header and body.
 * Returns undefined when selection is not enabled.
 */
export function useTableSelection<Row, Key extends AppTableRowKey>({
  data,
  rowKey,
  selectedKeys,
  onSelectionChange,
}: Options<Row, Key>) {
  if (!onSelectionChange) return undefined;

  const selected = new Set(selectedKeys);
  const keys = data.map(rowKey);

  // Whether every row in the current data is selected.
  const allSelected = keys.length > 0 && keys.every((key) => selected.has(key));

  // Used to display the indeterminate state of the select-all checkbox.
  const someSelected = keys.some((key) => selected.has(key));

  const toggleRow = (key: Key) => {
    const next = new Set(selected);

    if (next.has(key)) next.delete(key);
    else next.add(key);

    logSelectedRows(data, next, rowKey);
    onSelectionChange([...next]);
  };

  const toggleAll = () => {
    const next = new Set(selected);

    for (const key of keys) {
      if (allSelected) next.delete(key);
      else next.add(key);
    }

    logSelectedRows(data, next, rowKey);
    onSelectionChange([...next]);
  };

  return {
    header: {
      allSelected,
      someSelected,
      disabled: keys.length === 0,
      onToggle: toggleAll,
    },
    body: {
      keys: selected,
      onToggle: toggleRow,
    },
  };
}
