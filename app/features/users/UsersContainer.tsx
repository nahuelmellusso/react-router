import UsersTable from "~/features/users/UsersTable";
import { Button } from "~/components";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useI18n } from "~/hooks/useI18n";
import { Drawer } from "~/components";
import { useState } from "react";

export default function UsersContainer() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
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
        </div>
      </Drawer>
      <UsersTable />;
    </>
  );
}
