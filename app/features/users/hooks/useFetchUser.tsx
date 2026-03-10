import { useQuery, type QueryClient } from "@tanstack/react-query";
import { apiFetch } from "~/helpers/apiFetch";
import { HttpError } from "~/helpers/HttpError";
import type { User } from "../types/types";
import { usersKeys } from "./useFetchUsers";

type Options = {
  enabled?: boolean;
  staleTimeMs?: number;
  gcTimeMs?: number;
};

export function useFetchUser(id?: User["id"], options: Options = {}) {
  const { enabled = true, staleTimeMs = 30_000, gcTimeMs = 5 * 60_000 } = options;

  return useQuery<User, HttpError>({
    queryKey: ["users", "detail", id],
    queryFn: async () => {
      if (id == null) {
        throw new Error("User id is required");
      }

      const doRequest = apiFetch({
        method: "GET",
        url: `users/${id}`,
      });

      return (await doRequest()) as User;
    },
    enabled: enabled && id != null,
    staleTime: staleTimeMs,
    gcTime: gcTimeMs,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function invalidateUserDetail(queryClient: QueryClient, id: User["id"]) {
  return queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
}
