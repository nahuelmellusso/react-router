import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "~/helpers/apiFetch";
import type { CreateUserPayload } from "~/features/users/types/types";

export function useCreateUser() {
  return useMutation({
    mutationKey: ["create-user"],
    mutationFn: async (payload: CreateUserPayload) => {
      const doRequest = apiFetch({
        method: "POST",
        url: "auth/register",
        data: payload,
      });

      return await doRequest();
    },
    onSuccess: () => {},
    onError: () => {},
  });
}
