"use client";
import { Icon } from "@/components/ui/icon";

interface TopbarProps {
  crumbs: string[];
  year?: string;
  period?: string;
}

export function Topbar({ crumbs, year = "2024–2025", period = "3rd Period" }: TopbarProps) {
  return (
    <div className="flex items-center gap-4 px-7 py-3.5 border-b border-rule bg-paper sticky top-0 z-10">
      {/* Breadcrumbs */}
      <div className="flex gap-2 items-center text-[12.5px] text-ink-3">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-rule">›</span>}
            <span className={i === crumbs.length - 1 ? "text-ink" : ""}>{c}</span>
          </span>
        ))}
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="flex items-center gap-2 px-2.5 py-1.5 bg-paper-2 border border-rule rounded-md w-[300px] text-ink-3">
        <Icon name="search" size={14} />
        <input
          placeholder="Search students, subjects, classes…"
          className="border-none bg-transparent outline-none w-full text-[13px] text-ink placeholder:text-ink-3"
          readOnly
        />
        <span className="font-mono text-[10px] border border-rule px-1 rounded-sm text-ink-3 bg-paper">⌘K</span>
      </div>

      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-transparent bg-transparent text-ink-2 text-[13px] hover:bg-paper-3 transition-colors">
        <Icon name="bell" size={16} />
      </button>

      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-medium bg-wine-soft text-wine border border-[#e8c5cc]">
        <span className="w-1.5 h-1.5 rounded-full bg-current inline-block shrink-0" />
        {year} · {period}
      </div>
    </div>
  );
}
