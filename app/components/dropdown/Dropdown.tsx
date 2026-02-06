import React, { useMemo, useRef, useState } from "react";
import { useOnClickOutside } from "~/hooks/useOnClickOutside";

export type DropdownTriggerArgs = {
  open: boolean;
  toggle: () => void;
  close: () => void;
};

type DropdownItem = {
  label: string;
  to?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
};

type Props = {
  trigger: (args: DropdownTriggerArgs) => React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
  menuClassName?: string;
};

export function Dropdown({
  trigger,
  items,
  align = "left",
  className = "",
  menuClassName = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  useOnClickOutside(rootRef, close, open);

  const side = align === "right" ? "right-0" : "left-0";

  const content = useMemo(() => {
    return items.map((it) => {
      const base =
        "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-white/5 transition";
      const danger = it.danger ? "text-red-300 hover:text-red-200" : "text-zinc-200";

      if (it.to) {
        return (
          <a key={it.label} href={it.to} className={`${base} ${danger}`} onClick={() => close()}>
            {it.icon}
            {it.label}
          </a>
        );
      }

      return (
        <button
          key={it.label}
          type="button"
          className={`${base} ${danger} text-left`}
          onClick={() => {
            it.onClick?.();
            close();
          }}
        >
          {it.icon}
          {it.label}
        </button>
      );
    });
  }, [items]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {trigger({ open, toggle, close })}

      {open && (
        <div
          className={`absolute z-50 mt-2 min-w-56 ${side} rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur shadow-lg p-2 ${menuClassName}`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
