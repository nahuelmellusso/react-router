import React from "react";
import { cn } from "~/utils/utils";

type CardProps = {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  padding?: "none" | "sm" | "md" | "lg";
};

export default function Card({
  title,
  actions,
  children,
  className,
  contentClassName,
  padding = "md",
}: CardProps) {
  const paddingMap = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={cn(
        "rounded-xl",
        "border border-zinc-200 dark:border-zinc-800",
        "bg-white dark:bg-zinc-900",
        "shadow-sm",
        className,
      )}
    >
      {(title || actions) && (
        <div
          className={cn(
            "flex items-center justify-between",
            "border-b border-zinc-200 dark:border-zinc-800",
            "px-4 py-3",
          )}
        >
          <div className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</div>

          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className={cn(paddingMap[padding], contentClassName)}>{children}</div>
    </div>
  );
}
