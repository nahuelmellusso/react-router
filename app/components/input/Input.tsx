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
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-900 pointer-events-none">
            {children}
          </div>
        )}

        <input
          ref={ref}
          className={cn(
            "block w-full bg-transparent border-b border-gray-200 py-2 px-3 text-sm placeholder-gray-400 outline-none pl-8",
            "text-gray-900 dark:text-white",
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
