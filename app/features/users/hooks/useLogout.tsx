import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "~/helpers/apiFetch";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["logout-user"],
    mutationFn: async () => {
      const doRequest = apiFetch({
        method: "POST",
        url: "auth/logout",
      });

      return await doRequest();
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ["current-user"] });
    },
  });
}
