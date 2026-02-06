import React from "react";
import { Dropdown, type DropdownTriggerArgs } from "~/components/dropdown/Dropdown";

type Item = { label: string; to: string };

export function NavGroup({ label, items }: { label: string; items: Item[] }) {
  return (
    <Dropdown
      align="left"
      trigger={({ open, toggle }: DropdownTriggerArgs) => (
        <button
          type="button"
          onClick={toggle}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition 
          ${open ? "bg-white/10 text-white" : "text-zinc-200 hover:bg-white/5 hover:text-white"}`}
        >
          <span>{label}</span>
          <span className={`text-xs transition ${open ? "rotate-180" : ""}`}>▾</span>
        </button>
      )}
      items={items.map((i) => ({ label: i.label, to: i.to }))}
    />
  );
}
