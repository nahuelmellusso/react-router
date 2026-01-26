import { Navigate, Outlet, useLocation, useParams } from "react-router";
import { useCurrentUser } from "~/features/users/hooks/useCurrentUser";

export default function RequireAuthLayout() {
  const { data: user, isLoading, isError } = useCurrentUser();
  const { locale } = useParams();
  const location = useLocation();

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (isError || !user) {
    return <Navigate to={`/${locale}/auth/login`} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
