import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { NavGroup } from "./NavGroup";
import { UserMenu } from "./UserMenu";
import { MobileMenuDrawer } from "./MobileMenuDrawer";
import { useAuthSession } from "~/features/users/hooks/useAuthSession";
import logo from "~/assets/img/logo.png";
import { useI18n } from "~/hooks/useI18n";

export function Navbar() {
  const navigate = useNavigate();
  const { locale } = useParams<{ locale: string }>();
  const { t } = useI18n();
  const { user, isAuthed, logout, isLoggingOut } = useAuthSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const to = useCallback(
    (path: string) => {
      const clean = path.startsWith("/") ? path : `/${path}`;
      return locale ? `/${locale}${clean}` : clean;
    },
    [locale],
  );

  const handleLogout = async () => {
    try {
      await logout();
      setMobileOpen(false);
      navigate(to("/login"));
    } catch {
      // todo toast
    }
  };

  const groups = useMemo(
    () => [
      {
        label: t("dashboard.users"),
        items: [
          { label: t("dashboard.list"), to: to("/dashboard/users") },
          { label: t("dashboard.create"), to: to("/dashboard/users/new") },
        ],
      },
      {
        label: "Torneos",
        items: [
          { label: t("dashboard.list"), to: to("/dashboard/tournaments") },
          { label: t("dashboard.create"), to: to("/dashboard/tournaments/new") },
        ],
      },
      {
        label: "Settings",
        items: [
          { label: t("dashboard.settings"), to: to("/dashboard/settings") },
          { label: t("dashboard.security"), to: to("/dashboard/settings/security") },
        ],
      },
    ],
    [to],
  );

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4" style={{ backgroundColor: "#111827" }}>
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logo} alt="logo" width={50} />
              <a href={to("/dashboard")} className="text-zinc-100 font-semibold tracking-tight">
                Dashboard
              </a>

              <nav className="hidden lg:flex items-center gap-1 ml-2">
                {groups.map((g) => (
                  <NavGroup key={g.label} label={g.label} items={g.items} />
                ))}
              </nav>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              {/* Desktop auth */}
              <div className="hidden lg:block">
                {isAuthed ? (
                  <UserMenu
                    user={user}
                    onLogout={handleLogout}
                    isLoggingOut={isLoggingOut}
                    basePath={locale ? `/${locale}` : ""}
                  />
                ) : (
                  <a
                    href={to("/login")}
                    className="rounded-lg px-3 py-2 text-sm text-zinc-100 hover:bg-white/10"
                  >
                    Login
                  </a>
                )}
              </div>

              {/* Mobile button */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden rounded-lg px-3 py-2 text-zinc-100 hover:bg-white/10"
                aria-label="Open menu"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenuDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        groups={groups}
        userLabel={user?.name}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        basePath={locale ? `/${locale}` : ""}
      />
    </>
  );
}
