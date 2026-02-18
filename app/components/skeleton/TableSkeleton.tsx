import React from "react";

type Props = {
  rows?: number;
  cols?: number;
};

export function TableSkeleton({ rows = 6, cols = 3 }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full text-sm">
        <thead className="bg-black text-white">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left font-semibold">
                <div className="h-4 w-24 rounded bg-white/20" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {Array.from({ length: rows }).map((_, r) => (
            <tr
              key={r}
              className="odd:bg-white even:bg-zinc-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-800"
            >
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="px-4 py-3">
                  <div className="h-4 w-full max-w-[18rem] animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
