import React, { useCallback, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChartBarSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  HomeIcon,
  TrophyIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuthSession } from "~/features/users/hooks/useAuthSession";
import logo from "~/assets/img/logo.png";
import { useI18n } from "~/hooks/useI18n";
import { cn } from "~/utils/utils";

type NavItem = {
  label: string;
  to?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  soon?: boolean;
};

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { locale } = useParams<{ locale: string }>();
  const { t } = useI18n();
  const { user, isAuthed, logout, isLoggingOut } = useAuthSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const to = useCallback(
    (path: string) => {
      const clean = path.startsWith("/") ? path : `/${path}`;
      return locale ? `/${locale}${clean}` : clean;
    },
    [locale],
  );

  const initials =
    user?.name
      ?.split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  const handleLogout = async () => {
    try {
      await logout();
      setMobileOpen(false);
      navigate(to("/login"));
    } catch {
      // todo toast
    }
  };

  const navItems = useMemo<NavItem[]>(
    () => [
      { label: t("dashboard.title"), to: to("/dashboard"), icon: HomeIcon },
      { label: t("dashboard.nav.users"), to: to("/dashboard/users"), icon: UsersIcon },
      { label: t("dashboard.nav.tournaments"), icon: TrophyIcon, soon: true },
      { label: t("dashboard.nav.settings"), icon: Cog6ToothIcon, soon: true },
    ],
    [t, to],
  );

  const secondaryItems = useMemo<NavItem[]>(
    () => [{ label: "Analytics", icon: ChartBarSquareIcon, soon: true }],
    [],
  );

  const renderNavItems = (items: NavItem[]) =>
    items.map((item) => {
      const Icon = item.icon;
      const isActive = item.to ? location.pathname === item.to : false;

      const commonClassName = cn(
        "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center px-2" : "",
        isActive
          ? "bg-white text-slate-950 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.6)]"
          : "text-slate-300 hover:bg-white/8 hover:text-white",
        item.soon ? "opacity-75" : "",
      );

      const iconClassName = cn(
        "h-5 w-5 shrink-0",
        isActive ? "text-sky-500" : "text-slate-400 group-hover:text-slate-100",
      );

      const content = (
        <>
          <Icon className={iconClassName} />
          {!collapsed && (
            <>
              <span className="flex-1 truncate">{item.label}</span>
              {item.soon && (
                <span className="rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Soon
                </span>
              )}
            </>
          )}
        </>
      );

      if (item.to && !item.soon) {
        return (
          <Link
            key={item.label}
            to={item.to}
            className={commonClassName}
            onClick={() => setMobileOpen(false)}
          >
            {content}
          </Link>
        );
      }

      return (
        <div key={item.label} className={cn(commonClassName, "cursor-default")}>
          {content}
        </div>
      );
    });

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-20 items-center border-b border-white/10 px-4",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <Link
          to={to("/dashboard")}
          className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}
          onClick={() => setMobileOpen(false)}
        >
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300 shadow-[0_18px_40px_-24px_rgba(56,189,248,0.9)]">
            <img src={logo} alt="logo" className="h-6 w-6 object-contain" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                TourneyOS
              </p>
              <p className="text-base font-semibold text-white">{t("dashboard.title")}</p>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="hidden rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:inline-flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-3 py-5">
        <section className="space-y-2">
          {!collapsed && (
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Overview
            </p>
          )}
          <div className="space-y-1.5">{renderNavItems(navItems)}</div>
        </section>

        <section className="space-y-2">
          {!collapsed && (
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Insights
            </p>
          )}
          <div className="space-y-1.5">{renderNavItems(secondaryItems)}</div>
        </section>
      </div>

      <div className="border-t border-white/10 p-3">
        <div
          className={cn(
            "rounded-[24px] border border-white/10 bg-white/5 p-3",
            collapsed ? "flex justify-center p-2.5" : "space-y-3",
          )}
        >
          {collapsed ? (
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-sm font-semibold text-white">
              {initials}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-sm font-semibold text-white">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{user?.name ?? "User"}</p>
                  <p className="truncate text-xs text-slate-400">{user?.email ?? "Signed in"}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={!isAuthed || isLoggingOut}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/12 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex rounded-2xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
          aria-label="Open menu"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>

        <Link className="flex items-center gap-3" to={to("/dashboard")}>
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300">
            <img src={logo} alt="logo" className="h-5 w-5 object-contain" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              TourneyOS
            </p>
            <p className="text-sm font-semibold text-slate-900">{t("dashboard.title")}</p>
          </div>
        </Link>

        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
          {initials}
        </div>
      </div>

      <aside
        className={cn(
          "hidden h-screen shrink-0 border-r border-white/10 bg-[#0f172a] text-white shadow-[0_24px_80px_-45px_rgba(15,23,42,0.85)] lg:block",
          collapsed ? "w-[88px]" : "w-[284px]",
        )}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
          />

          <div className="absolute left-0 top-0 h-full w-[88%] max-w-[320px] border-r border-white/10 bg-[#0f172a] text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
