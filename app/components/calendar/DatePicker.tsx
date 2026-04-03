import * as React from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { Calendar } from "~/components/calendar/Calendar";
import { useOnClickOutside } from "~/hooks/useOnClickOutside";
import { cn } from "~/utils/utils";

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date>(value ?? new Date());
  const rootRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(rootRef, () => setOpen(false), open);

  React.useEffect(() => {
    if (value) {
      setMonth(value);
    }
  }, [value]);

  const isDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((current) => !current)}
        disabled={disabled}
        className={cn(
          "inline-flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/90 px-4 text-left text-sm font-medium text-slate-700 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] transition-all",
          "hover:border-sky-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/20",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span className={cn("truncate", !value && "text-slate-400")}>{value ? format(value, "PPP") : placeholder}</span>
        <CalendarDaysIcon className="h-5 w-5 shrink-0 text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+0.75rem)] z-50">
          <Calendar
            mode="single"
            month={month}
            onMonthChange={setMonth}
            selected={value}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
            disabled={isDisabled}
          />
        </div>
      )}
    </div>
  );
}
