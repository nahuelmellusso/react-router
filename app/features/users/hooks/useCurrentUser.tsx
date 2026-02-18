// src/features/auth/hooks/useCurrentUser.ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "~/helpers/apiFetch";
import { HttpError } from "~/helpers/HttpError";

export type CurrentUser = {
  id: string | number;
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export function useCurrentUser() {
  const DEV_FAKE_AUTH = import.meta.env.DEV && import.meta.env.VITE_FAKE_AUTH === "true";

  if (DEV_FAKE_AUTH) {
    const devUser: CurrentUser = {
      id: 1,
      name: "Dev User",
      email: "dev@local.test",
      avatarUrl: null,
    };

    return {
      data: devUser as CurrentUser | null,
      isLoading: false,
      isError: false,
      error: null as unknown,
      isFetching: false,
      refetch: async () => ({ data: devUser }),
    };
  }

  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      try {
        const doRequest = apiFetch({ method: "GET", url: "auth/me" });
        return (await doRequest()) as CurrentUser;
      } catch (e) {
        if (e instanceof HttpError && (e.status === 401 || e.status === 403)) {
          return null;
        }
        throw e;
      }
    },

    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60_000,
  });
}
