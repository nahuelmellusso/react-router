import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useCurrentUser } from "~/features/users/hooks/useCurrentUser";

export default function RequireAuthLayout() {
  const { data: user, isLoading } = useCurrentUser();
  const { locale } = useParams();
  const location = useLocation();
  const safeLocale = locale ?? "en";
  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  /*return <Outlet />;*/

  const isLogin = location.pathname.endsWith("/auth/login");

  if (!user && !isLogin) {
    return <Navigate to={`/${safeLocale}/auth/login`} replace />;
  }

  return <Outlet />;
}
