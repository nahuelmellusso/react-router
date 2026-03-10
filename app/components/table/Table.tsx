import type { columnType } from "~/components/table/types";

export type TableProps<T> = {
  columns: columnType<T>[];
  data: T[];
  rowKey?: (row: T) => string | number;
  isLoading?: boolean;
  emptyText?: string;
};
export default function Table<T>({
  columns,
  data,
  rowKey,
  /*isLoading,
  emptyText = "No results",*/
}: TableProps<T>) {
  /* if (isLoading) return <div className="p-4">Loading...</div>;

  if (!data.length) {
    return <div className="p-4 text-sm text-zinc-500">{emptyText}</div>;
  }*/

  const rowClass =
    "odd:bg-white even:bg-zinc-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700";
  return (
    <div className="overflow-x-auto rounded-lg">
      <table className={rowClass}>
        <thead className="bg-black text-white">
          <tr>
            {columns.map((column, i) => (
              <th className="px-4 py-3 text-left font-semibold" key={i}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {data.map((row, rIdx) => (
            <tr
              key={rowKey ? rowKey(row) : rIdx}
              className="odd:bg-white even:bg-zinc-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              {columns.map((c, cIdx) => (
                <td key={cIdx} className={`px-4 py-3 ${c.className ?? ""}`}>
                  {c.cell ? c.cell(row) : c.accessorKey ? String(row[c.accessorKey] ?? "") : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
