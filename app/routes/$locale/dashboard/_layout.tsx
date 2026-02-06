import { Outlet } from "react-router-dom";
import styles from "~/routes/$locale/auth/Home.module.css";
import { Link, useLocation, useParams } from "react-router";
import { useLocaleHref } from "~/hooks/useLocaleHref";
import { Navbar } from "~/components/navbar/NavBar";
export default function DashboardLayout() {
  const makeHref = useLocaleHref();
  return (
    <div>
      <Navbar />
      {/*  <h1 className="text-lg font-semibold">{t("app.title")}</h1>
                <nav className="flex gap-3">
                    <Link to={`/${locale}`}>{t("nav.home")}</Link>
                    <Link to={`/${locale}/dashboard`}>{t("nav.dashboard")}</Link>
                </nav>*/}
      {/*<div className="ml-auto flex gap-2">
          <Link to={makeHref("en")}>EN</Link>
          <span>|</span>
          <Link to={makeHref("es")}>ES</Link>
        </div>*/}

      <main className="flex items-center justify-center min-h-screen">
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
