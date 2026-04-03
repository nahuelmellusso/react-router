import React, { type ReactNode } from "react";
import { cn } from "~/utils/utils";

type FormFieldProps = {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {children}

      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
