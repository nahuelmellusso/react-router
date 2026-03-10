import UsersTable from "~/features/users/UsersTable";
import { Button } from "~/components";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useI18n } from "~/hooks/useI18n";
import { Drawer } from "~/components";
import { useState } from "react";
import { useFetchUsers } from "~/features/users/hooks/useFetchUsers";
import { TableSkeleton } from "~/components/skeleton/TableSkeleton";
import { useId } from "react";
import type { User } from "~/features/users/types/types";
import UserForm, { type UserFormValues } from "~/features/users/UserForm";
import { useNavigate, useParams } from "react-router";
import { showToast } from "~/helpers/showToast";
import { useCreateUser } from "~/hooks/useCreateUser";
import { useFetchUser } from "~/features/users/hooks/useFetchUser";
import { getApiErrorMessage } from "~/helpers/getApiErrorMessage";
import { useUpdateUser } from "~/features/users/hooks/useUpdateUser";

export default function UsersContainer() {
  const { t, locale } = useI18n();
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [localSelectedUser, setLocalSelectedUser] = useState<User | null>(null);
  const { mutate: createUser, isPending: createPending } = useCreateUser();
  const { mutate: updateUser, isPending: updatePending } = useUpdateUser();
  const usersQuery = useFetchUsers();
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = id ? Number(id) : undefined;

  const userQuery = useFetchUser(userId, {
    enabled: !!userId,
  });

  const selectedUser = userId != null ? (userQuery.data ?? null) : localSelectedUser;
  const isEditMode = userId != null || localSelectedUser != null;
  const isDrawerOpen = userId != null ? true : open;
  const isPending = createPending || updatePending;
  const onSubmit = (data: UserFormValues) => {
    const onError = (err: unknown) => {
      showToast({
        type: "error",
        message: getApiErrorMessage(err, t("account.error")),
      });
    };

    if (isEditMode && selectedUser) {
      updateUser(
        { id: selectedUser.id, data },
        {
          onSuccess: () => {
            showToast({
              type: "success",
              message: t("user.updated"),
            });
            setOpen(false);
          },
          onError,
        },
      );

      return;
    }

    createUser(data, {
      onSuccess: () => {
        showToast({
          type: "success",
          message: t("account.created"),
        });
        navigate(`/${locale}/auth/login`);
      },
      onError,
    });
  };
  const handleEdit = (u: User) => {
    setLocalSelectedUser(u);
    setOpen(true);
  };

  return (
    <>
      <div className={"my-2 text-right"}>
        <Button text={t("user.create")} Icon={PlusIcon} onClick={() => setOpen(true)} />
      </div>
      <Drawer
        open={isDrawerOpen}
        onClose={() => {
          setOpen(false);
          setLocalSelectedUser(null);
        }}
        title={isEditMode ? t("user.edit") : t("user.create")}
        description="Fill the form and save."
        isBusy={isPending}
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <button
              className="rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-white/10"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </button>
            <Button text={"Save"} isLoading={isPending} type={"submit"} form={formId} />
          </div>
        }
      >
        <div className="space-y-3">
          <UserForm id={formId} user={selectedUser} onSubmit={onSubmit} />
        </div>
      </Drawer>
      {usersQuery.isLoading ? (
        <TableSkeleton rows={8} cols={3} />
      ) : usersQuery.isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {usersQuery.error?.message ?? "Failed to load users"}
        </div>
      ) : (
        <UsersTable users={usersQuery.data?.data ?? []} onEdit={handleEdit} />
      )}
    </>
  );
}
