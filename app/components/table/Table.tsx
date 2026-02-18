type columnType = {
  label: string;
  sortable: boolean;
};

type TableProps = {
  columns: columnType[];
};
export default function table({ columns }: TableProps) {
  const rowClass =
    "odd:bg-white even:bg-zinc-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700";
  return (
    <div className="overflow-x-auto rounded-lg">
      <table className={rowClass}>
        <thead className="bg-black text-white">
          <tr>
            {columns.map((column) => (
              <th className="px-4 py-3 text-left font-semibold" key={column.label}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          <tr className="odd:bg-white even:bg-zinc-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700">
            <td className="px-4 py-3">The Sliding Mr. Bones (Next Stop, Pottersville)</td>
            <td className="px-4 py-3">Malcolm Lockyer</td>
            <td className="px-4 py-3">1961</td>
          </tr>

          <tr className="odd:bg-white even:bg-zinc-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700">
            <td className="px-4 py-3">Witchy Woman</td>
            <td className="px-4 py-3">The Eagles</td>
            <td className="px-4 py-3">1972</td>
          </tr>

          <tr className="odd:bg-white even:bg-zinc-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700">
            <td className="px-4 py-3">Shining Star</td>
            <td className="px-4 py-3">Earth, Wind, and Fire</td>
            <td className="px-4 py-3">1975</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
