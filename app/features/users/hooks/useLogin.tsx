import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "~/helpers/apiFetch";
import type { LoginPayload } from "~/features/users/types/types";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["login-user"],
    mutationFn: async (payload: LoginPayload) => {
      const doRequest = apiFetch({
        method: "POST",
        url: "auth/login",
        data: payload,
      });

      return await doRequest();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
}
