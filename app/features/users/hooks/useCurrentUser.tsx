import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "~/helpers/apiFetch";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const doRequest = apiFetch({
        method: "GET",
        url: "auth/me",
      });
    },
    retry: false,
    staleTime: 60_000,
  });
}
