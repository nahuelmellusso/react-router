import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "~/helpers/apiFetch";
import { HttpError } from "~/helpers/HttpError";
import type { TenantContextResponse } from "~/features/tenant/types";

export function useTenantContext() {
  const DEV_FAKE_AUTH = import.meta.env.DEV && import.meta.env.VITE_FAKE_AUTH === "true";

  if (DEV_FAKE_AUTH) {
    const devTenant: TenantContextResponse = {
      tenant: {
        id: 1,
        name: "Dev Championship",
        slug: "dev-championship",
        isActive: true,
        status: "active",
      },
      domain: {
        domain: "dev.localhost",
        isActive: true,
      },
    };

    return {
      data: devTenant,
      isLoading: false,
      isError: false,
      error: null as unknown,
      isFetching: false,
      refetch: async () => ({ data: devTenant }),
    };
  }

  return useQuery({
    queryKey: ["tenant-context"],
    queryFn: async () => {
      try {
        const doRequest = apiFetch({ method: "GET", url: "tenant-context" });
        return (await doRequest()) as TenantContextResponse;
      } catch (e) {
        if (e instanceof HttpError && (e.status === 400 || e.status === 404)) {
          return null;
        }
        throw e;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60_000,
  });
}
