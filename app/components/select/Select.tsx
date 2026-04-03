import React, { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "~/utils/utils";
import { useOnClickOutside } from "~/hooks/useOnClickOutside";

export type SelectOption<V extends string | number = string> = {
  value: V;
  label: string;
  disabled?: boolean;
};

type CommonProps<V extends string | number> = {
  options: SelectOption<V>[];
  value?: V | null;
  onChange?: (value: V | null, option?: SelectOption<V>) => void;
  multiple?: boolean;
  values?: V[];
  onChangeMany?: (value: V[], options: SelectOption<V>[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  maxMenuHeightClassName?: string;
  children?: ReactNode;
};

function isMulti<V extends string | number>(
  p: CommonProps<V>,
): p is CommonProps<V> & {
  multiple: true;
  values: V[];
  onChangeMany: (value: V[], options: SelectOption<V>[]) => void;
} {
  return !!p.multiple;
}

export function Select<V extends string | number = string>(props: CommonProps<V>) {
  const {
    options,
    placeholder = "Select...",
    disabled = false,
    className,
    buttonClassName,
    menuClassName,
    searchable = false,
    searchPlaceholder = "Search...",
    maxMenuHeightClassName = "max-h-72",
    children,
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useOnClickOutside(rootRef, () => setOpen(false), open);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const valueSet = useMemo(() => {
    if (isMulti(props)) return new Set(props.values ?? []);
    return new Set(props.value != null ? [props.value] : []);
  }, [props]);

  const selectedOptions = useMemo(() => {
    const map = new Map(options.map((o) => [o.value, o] as const));
    return Array.from(valueSet)
      .map((v) => map.get(v))
      .filter(Boolean) as SelectOption<V>[];
  }, [options, valueSet]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return options;
    return options.filter((o) => o.label.toLowerCase().includes(query));
  }, [options, q]);

  const hasSelection = selectedOptions.length > 0;

  const toggle = () => {
    if (disabled) return;
    setOpen((s) => !s);
  };

  const clear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (isMulti(props)) {
      props.onChangeMany?.([], []);
    } else {
      props.onChange?.(null, undefined);
    }
  };

  const selectOption = (opt: SelectOption<V>) => {
    if (disabled || opt.disabled) return;

    if (isMulti(props)) {
      const current = props.values ?? [];
      const exists = valueSet.has(opt.value);
      const next = exists ? current.filter((v) => v !== opt.value) : [...current, opt.value];
      const nextOptions = options.filter((o) => next.includes(o.value));
      props.onChangeMany?.(next, nextOptions);
      return;
    }

    props.onChange?.(opt.value, opt);
    setOpen(false);
  };

  const removeChip = (v: V) => {
    if (!isMulti(props) || disabled) return;
    const current = props.values ?? [];
    const next = current.filter((x) => x !== v);
    const nextOptions = options.filter((o) => next.includes(o.value));
    props.onChangeMany?.(next, nextOptions);
  };

  const leftPad = children ? "pl-10" : "pl-3";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        className={cn(
          "relative block h-11 w-full rounded-xl border border-slate-200 bg-white/80 px-3 text-sm text-slate-900 outline-none transition-all",
          "shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-500/10",
          disabled && "cursor-not-allowed opacity-50",
          buttonClassName,
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {children && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {children}
          </div>
        )}

        <div className={cn("flex items-center justify-between gap-2", leftPad)}>
          <div className="min-w-0 flex-1 text-left">
            {isMulti(props) ? (
              hasSelection ? (
                <div className="flex flex-wrap gap-1">
                  {selectedOptions.map((opt) => (
                    <span
                      key={String(opt.value)}
                      className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2 py-1 text-xs text-slate-700"
                    >
                      {opt.label}
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeChip(opt.value);
                        }}
                        className="text-slate-400 hover:text-slate-900"
                        aria-label={`Remove ${opt.label}`}
                        title="Remove"
                      >
                        x
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400">{placeholder}</span>
              )
            ) : hasSelection ? (
              <span className="truncate">{selectedOptions[0]?.label}</span>
            ) : (
              <span className="text-slate-400">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasSelection && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={clear}
                className="rounded-md px-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear"
                title="Clear"
              >
                x
              </span>
            )}
            <span className={cn("text-xs text-slate-400 transition-transform", open && "rotate-180")}>
              v
            </span>
          </div>
        </div>
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur",
            menuClassName,
          )}
          role="listbox"
        >
          {searchable && (
            <div className="border-b border-slate-100 p-2">
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className={cn(
                    "block h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-all",
                    "focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-500/10",
                  )}
                  placeholder={searchPlaceholder}
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className={cn("overflow-auto", maxMenuHeightClassName)}>
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500">No results</div>
            ) : (
              filtered.map((opt) => {
                const selected = valueSet.has(opt.value);

                return (
                  <button
                    type="button"
                    key={String(opt.value)}
                    onClick={() => selectOption(opt)}
                    disabled={opt.disabled}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm transition",
                      "hover:bg-slate-50",
                      selected && "bg-sky-50 text-sky-700",
                      opt.disabled && "cursor-not-allowed opacity-50",
                    )}
                    role="option"
                    aria-selected={selected}
                  >
                    <span className="truncate">{opt.label}</span>
                    {selected && <span className="text-xs">?</span>}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
