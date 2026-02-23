import UsersTable from "~/features/users/UsersTable";
import { Button } from "~/components";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useI18n } from "~/hooks/useI18n";
import { Drawer } from "~/components";
import { useState } from "react";
import { useFetchUsers } from "~/features/users/hooks/useFetchUsers";
import { TableSkeleton } from "~/components/skeleton/TableSkeleton";
import type { User } from "~/features/users/types/types";

export default function UsersContainer() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const usersQuery = useFetchUsers();

  const handleEdit = (u: User) => {
    setSelectedUser(u);
    setOpen(true);
  };

  return (
    <>
      <div className={"my-2 text-right"}>
        <Button text={t("user.create")} Icon={PlusIcon} onClick={() => setOpen(true)} />
      </div>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Create user"
        description="Fill the form and save."
        isBusy={saving}
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <button
              className="rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <Button text={"Save"} />
            {/*<button
              className="rounded-lg px-3 py-2 text-sm bg-zinc-900 text-white dark:bg-white dark:text-black disabled:opacity-50"
              onClick={async () => {
                setSaving(true);
                try {
                  // await createUser(...)
                } finally {
                  setSaving(false);
                  setOpen(false);
                }
              }}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>*/}
          </div>
        }
      >
        {/* form goes here */}
        <div className="space-y-3">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Your form fields here…</div>
          <pre className="text-xs opacity-70">{JSON.stringify(selectedUser, null, 2)}</pre>
        </div>
      </Drawer>
      {usersQuery.isLoading ? (
        <TableSkeleton rows={8} cols={3} />
      ) : usersQuery.isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {usersQuery.error?.message ?? "Failed to load users"}
        </div>
      ) : (
        <UsersTable users={usersQuery.data?.data ?? []} onEdit={() => {}} />
      )}
    </>
  );
}
