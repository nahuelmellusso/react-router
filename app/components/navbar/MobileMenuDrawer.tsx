import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

function usePresence(isOpen: boolean, durationMs: number) {
  const [isPresent, setIsPresent] = useState(isOpen);
  const timeoutRef = useRef<number | null>(null);

  // Mount immediately when opening (layout effect avoids flicker)
  useLayoutEffect(() => {
    if (!isOpen) return;
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setIsPresent(true);
  }, [isOpen]);

  // Unmount after animation when closing
  useEffect(() => {
    if (isOpen) return;

    timeoutRef.current = window.setTimeout(() => {
      setIsPresent(false);
    }, durationMs);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [isOpen, durationMs]);

  return isPresent;
}

type Group = { label: string; items: { label: string; to: string }[] };

type Props = {
  open: boolean;
  onClose: () => void;
  groups: Group[];
  userLabel?: string;
  onLogout: () => Promise<void> | void;
  isLoggingOut?: boolean;
  basePath?: string;
};

const ANIMATION_MS = 220;

export function MobileMenuDrawer({
  open,
  onClose,
  groups,
  onLogout,
  userLabel,
  isLoggingOut = false,
  basePath = "",
}: Props) {
  const shouldRender = usePresence(open, ANIMATION_MS);

  // Close on Escape
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Lock body scroll while rendered
  useEffect(() => {
    if (!shouldRender) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [shouldRender]);

  const to = useMemo(() => {
    return (path: string) => {
      if (!basePath) return path;
      if (path.startsWith("/")) return `${basePath}${path}`;
      return path;
    };
  }, [basePath]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* overlay */}
      <button
        type="button"
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black/50 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        aria-label="Close menu"
      />

      {/* panel */}
      <div
        className={[
          "absolute right-0 top-0 h-full w-[85%] max-w-sm bg-zinc-950 border-l border-white/10 shadow-xl p-4",
          "transition-transform will-change-transform",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        style={{ transitionDuration: `${ANIMATION_MS}ms` }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-200">{userLabel ? `Hi, ${userLabel}` : "Menu"}</div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-zinc-200 hover:bg-white/5"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-6">
          {groups.map((g) => (
            <div key={g.label}>
              <div className="text-xs uppercase tracking-wider text-zinc-500 px-2">{g.label}</div>

              <div className="mt-2 space-y-1">
                {g.items.map((it) => (
                  <Link
                    key={it.label}
                    to={to(it.to)}
                    onClick={onClose}
                    className="block rounded-lg px-3 py-2 text-zinc-200 hover:bg-white/5"
                  >
                    {it.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-white/10 space-y-1">
            <Link
              to={to("/dashboard/settings")}
              onClick={onClose}
              className="block rounded-lg px-3 py-2 text-zinc-200 hover:bg-white/5"
            >
              Settings
            </Link>

            <button
              type="button"
              disabled={isLoggingOut}
              onClick={async () => {
                if (isLoggingOut) return;
                await onLogout();
                onClose();
              }}
              className="w-full text-left rounded-lg px-3 py-2 text-red-300 hover:bg-white/5 hover:text-red-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
