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
  emptyText = "No data available yet.",
}: TableProps<T>) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/85 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-slate-700">
          <thead className="bg-slate-50/80 text-slate-500">
            <tr>
              {columns.map((column, i) => (
                <th
                  className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]"
                  key={i}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.map((row, rIdx) => (
              <tr
                key={rowKey ? rowKey(row) : rIdx}
                className="bg-white/70 transition hover:bg-sky-50/60"
              >
                {columns.map((c, cIdx) => (
                  <td key={cIdx} className={`px-5 py-4 align-middle ${c.className ?? ""}`}>
                    {c.cell ? c.cell(row) : c.accessorKey ? String(row[c.accessorKey] ?? "") : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!data.length && <div className="px-5 py-10 text-center text-sm text-slate-500">{emptyText}</div>}
    </div>
  );
}
