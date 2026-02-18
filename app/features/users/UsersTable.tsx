import { Table } from "~/components";
export default function UsersTable() {
  const columns = [
    {
      label: "Name",
      sortable: false,
    },
    {
      label: "Email",
      sortable: false,
    },
    {
      label: "Position",
      sortable: false,
    },
  ];

  /*  {isLoading ? <TableSkeleton rows={8} cols={3} /> : <UsersTable />}*/

  return <Table columns={columns} />;
}
