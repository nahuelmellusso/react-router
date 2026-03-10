import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "~/utils/utils";

type Props = {
  open: boolean;
  onClose: () => void;

  title?: string;
  description?: string;

  children: React.ReactNode;
  footer?: React.ReactNode;

  /** width preset */
  size?: "sm" | "md" | "lg" | "xl";
  /** close when clicking overlay */
  closeOnOverlay?: boolean;
  /** close on ESC */
  closeOnEsc?: boolean;
  /** lock body scroll */
  lockScroll?: boolean;

  className?: string;
};

const sizeClass: Record<NonNullable<Props["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-xl",
  xl: "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "lg",
  closeOnOverlay = true,
  closeOnEsc = true,
  lockScroll = true,
  className,
}: Props) {
  // for smooth exit animation
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEsc, onClose]);

  useEffect(() => {
    if (!lockScroll) return;
    if (!mounted) return;

    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, mounted, lockScroll]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* overlay */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={closeOnOverlay ? onClose : undefined}
        className={cn(
          "absolute inset-0 bg-black/60",
          "transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* center */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full",
            sizeClass[size],
            "rounded-2xl border shadow-xl",
            "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
            "transition-all duration-200 ease-out",
            open ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]",
            className,
          )}
          onTransitionEnd={() => {
            if (!open) setMounted(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={title ?? "Modal"}
        >
          {(title || description) && (
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {title && (
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {title}
                    </div>
                  )}
                  {description && (
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {description}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-2 py-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="p-4">{children}</div>

          {footer && (
            <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">{footer}</div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
