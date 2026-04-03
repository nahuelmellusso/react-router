import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { cn } from "~/utils/utils";

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: DayPickerProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("rounded-[28px] border border-white/60 bg-white/92 p-4 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)] backdrop-blur", className)}
      classNames={{
        root: "w-fit",
        months: "flex flex-col gap-4 sm:flex-row sm:gap-5",
        month: "space-y-4",
        month_caption: "relative flex items-center justify-center px-10 pt-1",
        caption_label: "text-sm font-semibold text-slate-900",
        nav: "flex items-center gap-2",
        button_previous:
          "absolute left-0 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700",
        button_next:
          "absolute right-0 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "h-9 w-10 rounded-md text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400",
        week: "mt-1 flex w-full",
        day: "h-10 w-10 p-0 text-center text-sm",
        day_button:
          "inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium text-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/30 hover:bg-slate-100",
        selected:
          "bg-sky-500 text-white shadow-[0_12px_24px_-18px_rgba(14,165,233,0.85)] hover:bg-sky-500 hover:text-white",
        today: "border border-sky-200 bg-sky-50 text-sky-700",
        outside: "text-slate-300 aria-selected:bg-slate-100 aria-selected:text-slate-400",
        disabled: "cursor-not-allowed opacity-40",
        hidden: "invisible",
        range_start: "rounded-l-xl bg-sky-500 text-white hover:bg-sky-500",
        range_end: "rounded-r-xl bg-sky-500 text-white hover:bg-sky-500",
        range_middle: "rounded-none bg-sky-50 text-sky-700 hover:bg-sky-100",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...chevronProps }) => {
          const Icon = orientation === "left" ? ChevronLeftIcon : ChevronRightIcon;
          return <Icon className={cn("h-4 w-4", className)} {...chevronProps} />;
        },
      }}
      {...props}
    />
  );
}
