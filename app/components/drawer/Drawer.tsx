import React, { useEffect, useId, useRef, useState } from "react";
import { cn } from "~/utils/utils";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;

  // prevents closing (e.g. while saving)
  isBusy?: boolean;

  // width on >= sm, mobile always full width
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

  // mount/unmount with animation
  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  // lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // esc to close
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!isBusy) onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, isBusy]);

  // autofocus panel for accessibility
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
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close drawer"
        onClick={requestClose}
        className={cn(
          "absolute inset-0",
          "bg-black/50 backdrop-blur-sm",
          "transition-opacity duration-300 ease-out",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        onTransitionEnd={onTransitionEnd}
        className={cn(
          "absolute right-0 top-0 h-full",
          // ✅ mobile full width
          "w-full",
          // ✅ desktop width
          SIZE_MAP[size],
          "bg-white dark:bg-zinc-950",
          "border-l border-zinc-200 dark:border-zinc-800",
          "shadow-2xl",
          "outline-none",
          "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "will-change-transform",
          open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
          <div className="min-w-0">
            {title && (
              <div
                id={titleId}
                className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate"
              >
                {title}
              </div>
            )}
            {description && (
              <div id={descId} className="text-sm text-zinc-500 dark:text-zinc-400">
                {description}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={requestClose}
            disabled={isBusy}
            className={cn(
              "rounded-lg px-3 py-2 text-sm",
              "text-zinc-700 hover:bg-zinc-100",
              "dark:text-zinc-200 dark:hover:bg-white/10",
              isBusy && "opacity-50 cursor-not-allowed",
            )}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="h-[calc(100%-56px)] flex flex-col">
          <div className={cn("flex-1 overflow-y-auto px-4 py-4")}>{children}</div>

          {/* Footer */}
          {footer && (
            <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-3">{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
}
