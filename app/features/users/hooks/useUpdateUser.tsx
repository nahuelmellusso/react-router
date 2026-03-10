import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "~/helpers/apiFetch";
import { invalidateUsersList, usersKeys } from "./useFetchUsers";
import type { User } from "../types/types";
import type { UserFormValues } from "../UserForm";

type UpdateUserPayload = {
  id: User["id"];
  data: UserFormValues;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateUserPayload) => {
      const doRequest = apiFetch({
        method: "PATCH",
        url: `users/${id}`,
        data: data,
      });

      return await doRequest();
    },
    onSuccess: async (_, variables) => {
      await invalidateUsersList(queryClient);
      await queryClient.invalidateQueries({
        queryKey: usersKeys.detail(variables.id),
      });
    },
  });
}
