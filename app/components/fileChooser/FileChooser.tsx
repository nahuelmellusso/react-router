import React, { forwardRef } from "react";
import { cn } from "~/utils/utils";

type Props = {
  accept?: string;
  disabled?: boolean;
  onPick: (file: File | null) => void;
  className?: string;
  buttonClassName?: string;
  children?: React.ReactNode;
};

export const FileChooser = forwardRef<HTMLInputElement, Props>(
  ({ accept = "image/*", disabled, onPick, className, buttonClassName, children }, ref) => {
    return (
      <div className={cn("inline-flex", className)}>
        <input
          ref={ref}
          type="file"
          accept={accept}
          disabled={disabled}
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />

        <button
          type="button"
          disabled={disabled}
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            "bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-white dark:text-black dark:hover:bg-zinc-200",
            buttonClassName,
          )}
          onClick={() => (ref as any)?.current?.click?.()}
        >
          {children ?? "Choose file"}
        </button>
      </div>
    );
  },
);

FileChooser.displayName = "FileChooser";
