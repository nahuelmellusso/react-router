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
        "overflow-hidden rounded-[28px] border border-white/60 bg-white/85 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.45)] backdrop-blur",
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="font-semibold text-slate-900">{title}</div>

          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className={cn(paddingMap[padding], contentClassName)}>{children}</div>
    </div>
  );
}
