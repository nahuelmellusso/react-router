import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { apiFetch, type QueryParams } from "~/helpers/apiFetch";
import { HttpError } from "~/helpers/HttpError";
import type { Paginated, User, UsersQueryParams } from "../types/types";

function toQueryParams(params: UsersQueryParams): QueryParams {
  const qp: Record<string, string> = {};
  if (params.page != null) qp.page = String(params.page);
  if (params.perPage != null) qp.perPage = String(params.perPage);
  if (params.search) qp.search = params.search;
  if (params.sortBy) qp.sortBy = params.sortBy;
  if (params.sortDir) qp.sortDir = params.sortDir;
  return qp;
}

export const usersKeys = {
  all: ["users"] as const,
  list: (params: UsersQueryParams) => [...usersKeys.all, "list", params] as const,
  detail: (id: User["id"]) => [...usersKeys.all, "detail", id] as const,
};

type Options = {
  enabled?: boolean;
  staleTimeMs?: number;
  gcTimeMs?: number;
};

export function useFetchUsers(params: UsersQueryParams = {}, options: Options = {}) {
  const { enabled = true, staleTimeMs = 30_000, gcTimeMs = 5 * 60_000 } = options;

  return useQuery<Paginated<User>, HttpError>({
    queryKey: usersKeys.list(params),
    queryFn: async () => {
      const doRequest = apiFetch({
        method: "GET",
        url: "users",
        queryParams: toQueryParams(params),
      });

      try {
        return (await doRequest()) as Paginated<User>;
      } catch (e) {
        //  401/403 when cookie session is missing:
        if (e instanceof HttpError && (e.status === 401 || e.status === 403)) {
          throw e;
        }
        throw e;
      }
    },
    enabled,
    placeholderData: keepPreviousData,
    staleTime: staleTimeMs,
    gcTime: gcTimeMs,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
export function invalidateUsersList(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: usersKeys.all });
}
