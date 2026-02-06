import { useCurrentUser } from "./useCurrentUser";
import { useLogout } from "./useLogout";

export function useAuthSession() {
  const currentUser = useCurrentUser();
  const logout = useLogout();

  return {
    user: currentUser.data ?? undefined,
    isLoadingUser: currentUser.isLoading,
    isAuthed: !!currentUser.data,
    logout: logout.mutateAsync,
    isLoggingOut: logout.isPending,
  };
}
