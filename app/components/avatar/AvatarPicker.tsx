import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "~/utils/utils";
import { FileChooser } from "../fileChooser/FileChooser";
import { CropModal } from "./CropModal";
import { UserCircleIcon } from "@heroicons/react/24/outline";

type Props = {
  valueUrl?: string | null;
  valueFile?: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  fallbackInitials?: string;
};

const sizeMap = { sm: "h-10 w-10", md: "h-14 w-14", lg: "h-20 w-20" } as const;

export function AvatarPicker({
  valueUrl,
  valueFile = null,
  onChange,
  disabled,
  className,
  size = "md",
  fallbackInitials = "U",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  const selectedUrl = useMemo(() => {
    if (!valueFile) return null;
    return URL.createObjectURL(valueFile);
  }, [valueFile]);

  useEffect(() => {
    return () => {
      if (selectedUrl) URL.revokeObjectURL(selectedUrl);
    };
  }, [selectedUrl]);

  // preview temporal
  const pendingUrl = useMemo(() => {
    if (!pendingFile) return null;
    return URL.createObjectURL(pendingFile);
  }, [pendingFile]);

  useEffect(() => {
    return () => {
      if (pendingUrl) URL.revokeObjectURL(pendingUrl);
    };
  }, [pendingUrl]);

  const shownSrc = selectedUrl ?? valueUrl ?? null;

  const pick = (file: File | null) => {
    if (!file || disabled) return;
    setPendingFile(file);
    setCropOpen(true);
  };

  const remove = () => {
    if (disabled) return;
    onChange(null);
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div
        className={cn(
          "rounded-full overflow-hidden border grid place-items-center",
          "border-zinc-200 dark:border-white/10",
          "bg-zinc-100 dark:bg-white/10",
          sizeMap[size],
        )}
      >
        {shownSrc ? (
          <img src={shownSrc} alt="avatar" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full grid place-items-center">
            {/* Icono estándar */}
            <UserCircleIcon className="h-10 w-10 text-zinc-400 dark:text-zinc-300" />
            {/* o si preferís initials:
            <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-200">{fallbackInitials}</span>
            */}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <FileChooser ref={inputRef} disabled={disabled} onPick={pick}>
          {shownSrc ? "Change" : "Upload"}
        </FileChooser>

        {shownSrc && !disabled && (
          <button
            type="button"
            onClick={remove}
            className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            Remove
          </button>
        )}
      </div>

      {pendingUrl && (
        <CropModal
          open={cropOpen}
          src={pendingUrl}
          onCancel={() => {
            setCropOpen(false);
            setPendingFile(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
          onConfirm={(file) => {
            setCropOpen(false);
            setPendingFile(null);
            if (inputRef.current) inputRef.current.value = "";
            onChange(file); // 👈 guarda el File en RHF => aparece selectedUrl
          }}
        />
      )}
    </div>
  );
}
