import { useCurrentUser } from "./useCurrentUser";
import { useLogout } from "./useLogout";
import { useTenantContext } from "~/features/tenant/hooks/useTenantContext";

export function useAuthSession() {
  const currentUser = useCurrentUser();
  const tenantContext = useTenantContext();
  const logout = useLogout();

  return {
    user: currentUser.data?.user ?? undefined,
    tenant: currentUser.data?.tenant ?? tenantContext.data?.tenant ?? undefined,
    domain: currentUser.data?.domain ?? tenantContext.data?.domain ?? undefined,
    isLoadingUser: currentUser.isLoading,
    isLoadingTenant: tenantContext.isLoading,
    isAuthed: !!currentUser.data?.user,
    logout: logout.mutateAsync,
    isLoggingOut: logout.isPending,
  };
}
