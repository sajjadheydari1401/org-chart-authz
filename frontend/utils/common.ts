import { AppTableRowKey } from "@/components/common/ui/app-table/app-table";

// Log the actual table rows that are selected.
export const logSelectedRows = <Row, Key extends AppTableRowKey>(
  data: readonly Row[],
  keys: ReadonlySet<Key>,
  rowKey: (row: Row) => Key,
) => {
  const selectedRows = data.filter((row) => keys.has(rowKey(row)));

  console.log("Selected rows:", selectedRows);
};
