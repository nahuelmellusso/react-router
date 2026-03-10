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
    <div className={cn("space-y-1", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-gray-700 dark:text-zinc-200"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {children}

      {hint && !error && <p className="text-xs text-gray-500 dark:text-zinc-400">{hint}</p>}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
