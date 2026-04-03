import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  PlusIcon,
  TrophyIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Card, Button, Calendar, DatePicker } from "~/components";

const stats = [
  {
    label: "Active tournaments",
    value: "12",
    detail: "+3 this month",
    icon: TrophyIcon,
  },
  {
    label: "Registered players",
    value: "248",
    detail: "18 pending approvals",
    icon: UsersIcon,
  },
  {
    label: "Upcoming fixtures",
    value: "36",
    detail: "Next kickoff in 2 hours",
    icon: CalendarDaysIcon,
  },
];

const fixtures = [
  { match: "Falcons vs Titans", stage: "Quarterfinal", date: "Today, 19:30" },
  { match: "Aces vs Rapids", stage: "Group A", date: "Tomorrow, 18:00" },
  { match: "Blaze vs Nomads", stage: "Semifinal", date: "Thu, 21:15" },
];

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/60 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.92))] p-6 text-white shadow-[0_30px_90px_-55px_rgba(15,23,42,0.95)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200">
              Competition control center
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">Dashboard overview</h1>
              <p className="max-w-xl text-sm leading-6 text-slate-300">
                Manage tournaments, registrations and match flow from a cleaner workspace with
                stronger visual hierarchy.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              text="Create tournament"
              Icon={PlusIcon}
              className="border-0 bg-white text-slate-950 hover:bg-sky-50"
            />
            <Button
              text="View trends"
              Icon={ArrowTrendingUpIcon}
              className="border-white/12 bg-white/6 text-white hover:border-white/18 hover:bg-white/12 hover:text-white"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label} className="bg-white/78">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-semibold tracking-tight text-slate-950">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-500">{stat.detail}</p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-600">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
        <Card
          title="Upcoming fixtures"
          actions={<span className="text-xs font-medium text-slate-400">Synced 5m ago</span>}
        >
          <div className="space-y-3">
            {fixtures.map((fixture) => (
              <div
                key={fixture.match}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{fixture.match}</p>
                  <p className="text-sm text-slate-500">{fixture.stage}</p>
                </div>
                <span className="text-sm font-medium text-slate-500">{fixture.date}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Activity note">
          <div className="space-y-3 text-sm leading-6 text-slate-600">
            <p>
              The dashboard now leans into softer cards, more spacious forms and a sidebar with
              stronger active states, closer to the visual direction from your example.
            </p>
            <p>
              The next natural step would be giving tournaments and settings their own real pages
              so the new navigation can be completed end to end.
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card
          title="Date picker"
          actions={<span className="text-xs font-medium text-slate-400">Single date</span>}
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              This trigger version is ready for forms, filters and scheduling flows.
            </p>
            <DatePicker value={selectedDate} onChange={setSelectedDate} />
          </div>
        </Card>

        <Card
          title="Inline calendar"
          actions={<span className="text-xs font-medium text-slate-400">Range mode</span>}
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Same visual system, but exposed inline for dashboards or advanced scheduling screens.
            </p>
            <Calendar mode="range" selected={selectedRange} onSelect={setSelectedRange} numberOfMonths={2} className="w-full" />
          </div>
        </Card>
      </section>
    </div>
  );
}
