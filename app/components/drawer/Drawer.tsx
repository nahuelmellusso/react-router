import React, { useEffect, useId, useRef, useState } from "react";
import { cn } from "~/utils/utils";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  isBusy?: boolean;
  size?: "sm" | "md" | "lg";
  footer?: React.ReactNode;
};

const SIZE_MAP: Record<NonNullable<DrawerProps["size"]>, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
};

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  isBusy = false,
  size = "md",
  footer,
}: DrawerProps) {
  const [mounted, setMounted] = useState(open);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isBusy) {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, isBusy]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        panelRef.current?.focus();
      });
    }
  }, [open]);

  const requestClose = () => {
    if (isBusy) return;
    onClose();
  };

  const onTransitionEnd = () => {
    if (!open) setMounted(false);
  };

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close drawer"
        onClick={requestClose}
        className={cn(
          "absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 ease-out",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        onTransitionEnd={onTransitionEnd}
        className={cn(
          "absolute right-0 top-0 h-full w-full border-l border-white/60 bg-[#f8fbff]/95 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl outline-none transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
          SIZE_MAP[size],
          open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            {title && (
              <div id={titleId} className="truncate text-base font-semibold text-slate-900">
                {title}
              </div>
            )}
            {description && <div id={descId} className="text-sm text-slate-500">{description}</div>}
          </div>

          <button
            type="button"
            onClick={requestClose}
            disabled={isBusy}
            className={cn(
              "rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900",
              isBusy && "cursor-not-allowed opacity-50",
            )}
          >
            ?
          </button>
        </div>

        <div className="flex h-[calc(100%-56px)] flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
          {footer && <div className="border-t border-slate-100 px-5 py-4">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

