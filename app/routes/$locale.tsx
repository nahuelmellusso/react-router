import { Suspense } from "react";
import { Await, Outlet, type LoaderFunctionArgs, useLoaderData } from "react-router";
import { Spinner } from "~/components";
import { loader as localeLoader } from "~/hooks/useI18n";
import type { TenantContextResponse } from "~/features/tenant/types";

async function fetchTenantContext(request: Request): Promise<TenantContextResponse | null> {
  const tenantUrl = new URL("/api/v1/tenant-context", request.url);
  const response = await fetch(tenantUrl.toString(), {
    headers: {
      Accept: "application/json",
      cookie: request.headers.get("cookie") ?? "",
    },
  });

  if (response.status === 400 || response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Response("Failed to load tenant context", { status: response.status });
  }

  return (await response.json()) as TenantContextResponse;
}

export async function loader(args: LoaderFunctionArgs) {
  const localeData = await localeLoader(args);

  return {
    ...localeData,
    tenantContext: fetchTenantContext(args.request),
  };
}

export default function LocaleLayout() {
  const { tenantContext } = useLoaderData<typeof loader>();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner className="h-25 w-25 animate-spin" />
        </div>
      }
    >
      <Await resolve={tenantContext}>
        {() => (
          <div className="min-h-screen">
            <main className="p-4">
              <Outlet />
            </main>
          </div>
        )}
      </Await>
    </Suspense>
  );
}
