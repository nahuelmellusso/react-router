import React, { forwardRef, type ReactNode } from "react";
import { cn } from "~/utils/utils";

interface InputProps {
  children?: ReactNode;
  className?: string;
  inputClassName?: string;
  id?: string;
  type?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ children, className = "", inputClassName, ...rest }, ref) => {
    return (
      <div className={`relative ${className}`}>
        {children && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {children}
          </div>
        )}

        <input
          ref={ref}
          className={cn(
            "block h-11 w-full rounded-xl border border-slate-200 bg-white/80 px-3 text-sm text-slate-900 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] outline-none transition-all",
            "placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-500/10",
            children ? "pl-10" : "",
            inputClassName,
          )}
          {...rest}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
