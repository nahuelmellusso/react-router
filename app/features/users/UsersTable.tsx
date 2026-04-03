import { Table } from "~/components";
import type { User } from "~/features/users/types/types";
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import type { columnType } from "~/components/table/types";

type UserTableProps = {
  users: User[];
  onEdit: (user: User) => void;
};

export default function UsersTable({ users, onEdit }: UserTableProps) {
  const columns: columnType<User>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    {
      header: "",
      id: "actions",
      className: "w-[72px] text-right",
      cell: (u) => (
        <button
          type="button"
          onClick={() => onEdit(u)}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
          aria-label={`Edit ${u.name}`}
          title="Edit"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
      ),
    },
  ];

  return <Table columns={columns} data={users} rowKey={(u) => u.id} />;
}
