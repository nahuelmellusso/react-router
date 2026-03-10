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

  // multi
  multiple?: boolean;
  values?: V[];
  onChangeMany?: (value: V[], options: SelectOption<V>[]) => void;

  placeholder?: string;
  disabled?: boolean;

  /** container classes (like your Input wrapper className) */
  className?: string;
  /** button/input-like classes */
  buttonClassName?: string;
  /** dropdown panel classes */
  menuClassName?: string;

  searchable?: boolean;
  searchPlaceholder?: string;
  maxMenuHeightClassName?: string;

  /** left icon (same usage as Input) */
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
    placeholder = "Select…",
    disabled = false,
    className,
    buttonClassName,
    menuClassName,
    searchable = false,
    searchPlaceholder = "Search…",
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
      return; // keep open on multi
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

  const leftPad = children ? "pl-8" : "pl-3";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {/* Trigger (styled like your Input: underline only) */}
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        className={cn(
          "relative block w-full bg-transparent border-b border-gray-200 py-2 px-3 text-sm outline-none text-gray-900",
          "dark:border-white-700 dark:text-zinc-100",
          "focus:border-violet-500 transition-colors",
          disabled && "opacity-50 cursor-not-allowed",
          buttonClassName,
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* Left icon (like Input) */}
        {children && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-900 pointer-events-none dark:text-zinc-200">
            {children}
          </div>
        )}

        <div className={cn("flex items-center justify-between gap-2", leftPad)}>
          {/* Value area */}
          <div className="min-w-0 flex-1 text-left">
            {isMulti(props) ? (
              hasSelection ? (
                <div className="flex flex-wrap gap-1">
                  {selectedOptions.map((opt) => (
                    <span
                      key={String(opt.value)}
                      className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-white/10 dark:text-zinc-200"
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
                        className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                        aria-label={`Remove ${opt.label}`}
                        title="Remove"
                      >
                        ×
                      </span>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400">{placeholder}</span>
              )
            ) : hasSelection ? (
              <span className="truncate">{selectedOptions[0]?.label}</span>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {hasSelection && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={clear}
                className="rounded px-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Clear"
                title="Clear"
              >
                ×
              </span>
            )}
            <span className={cn("text-xs transition-transform", open && "rotate-180")}>▾</span>
          </div>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-full overflow-hidden rounded-lg border shadow-lg",
            "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
            menuClassName,
          )}
          role="listbox"
        >
          {searchable && (
            <div className="p-2 border-b border-zinc-200 dark:border-zinc-800">
              {/* search input also underline style */}
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className={cn(
                    "block w-full bg-transparent border-b border-gray-200 py-2 px-3 text-sm outline-none text-gray-900",
                    "dark:border-gray-700 dark:text-zinc-100",
                    "focus:border-violet-500 transition-colors",
                  )}
                  placeholder={searchPlaceholder}
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className={cn("overflow-auto", maxMenuHeightClassName)}>
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-zinc-500">No results</div>
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
                      "w-full px-3 py-2 text-left text-sm flex items-center justify-between gap-2",
                      "hover:bg-zinc-100 dark:hover:bg-white/10",
                      selected && "bg-zinc-100 dark:bg-white/10",
                      opt.disabled && "opacity-50 cursor-not-allowed",
                    )}
                    role="option"
                    aria-selected={selected}
                  >
                    <span className="truncate">{opt.label}</span>
                    {selected && <span className="text-xs">✓</span>}
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
