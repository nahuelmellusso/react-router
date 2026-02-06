// src/components/nav/UserMenu.tsx
import React from "react";
import { Dropdown } from "~/components/dropdown/Dropdown";

type Props = {
  user?: { name?: string; email?: string; avatarUrl?: string | null };
  onLogout: () => Promise<void> | void;

  /**
   * Optional: if you want locale-aware links
   * Example: basePath="/en" or "/es"
   * If omitted, routes remain absolute ("/dashboard/settings")
   */
  basePath?: string;

  /**
   * Optional: disable logout while mutation is running
   */
  isLoggingOut?: boolean;
};

export function UserMenu({ user, onLogout, basePath = "", isLoggingOut }: Props) {
  const initials =
    user?.name
      ?.split(" ")
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U";

  const to = (path: string) => {
    const clean = path.startsWith("/") ? path : `/${path}`;
    return basePath ? `${basePath}${clean}` : clean;
  };

  return (
    <Dropdown
      align="right"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className={`flex items-center gap-3 rounded-full px-2 py-1.5 transition 
          ${open ? "bg-white/10" : "hover:bg-white/5"}`}
        >
          <span className="hidden sm:block text-sm text-zinc-200">{user?.name ?? "User"}</span>

          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="avatar"
              className="h-8 w-8 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="h-8 w-8 rounded-full grid place-items-center bg-white/10 border border-white/10 text-zinc-100 text-xs font-semibold">
              {initials}
            </div>
          )}
        </button>
      )}
      items={[
        { label: "Settings", to: to("/dashboard/settings") },
        {
          label: isLoggingOut ? "Logging out..." : "Logout",
          onClick: () => {
            if (isLoggingOut) return;
            return onLogout();
          },
          danger: true,
        },
      ]}
      menuClassName="min-w-48"
    />
  );
}
