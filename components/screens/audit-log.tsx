"use client";
import { useState } from "react";
import { PageHead } from "@/components/page-head";
import { Icon } from "@/components/ui/icon";
import { AUDIT } from "@/lib/data";

const EXTRA_EVENTS = [
  { t:"May 17 14:22", who:"Mr. Cooper",        action:"locked marks for",     target:"Mathematics · 2nd Period" },
  { t:"May 17 10:08", who:"Ms. Wleh",           action:"entered marks for",    target:"Grade 3-B · English · 2nd Pd (24 students)" },
  { t:"May 16 16:30", who:"Principal Johnson",  action:"created user account", target:"Mr. Bility · Teacher · Grade 5-A" },
  { t:"May 16 09:14", who:"Mrs. Tarr (VPA)",   action:"rejected submission",  target:"Grade 7 · Bible · 2nd Pd", reason:"Three students missing marks" },
  { t:"May 15 13:45", who:"Principal Johnson",  action:"updated grading scale",target:"Below 70 label: 'Failing' → 'Not at This Time'" },
];

const ALL_EVENTS = [...AUDIT, ...EXTRA_EVENTS];
const FILTERS = ["All","Mark edits","Approvals","Overrides","Settings"] as const;

export function AuditLogScreen() {
  const [filter, setFilter] = useState<string>("All");

  return (
    <div className="p-7 pb-16 max-w-[1400px]">
      <PageHead
        title="Audit Log"
        sub="Immutable record of mark entries, overrides, approvals, and configuration changes"
        actions={<button className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-rule bg-paper-2 text-ink text-[13px] hover:bg-paper-3"><Icon name="download" size={14}/> Export</button>}
      />

      <div className="bg-paper-2 border border-rule rounded-lg">
        <div className="px-[18px] py-3.5 border-b border-rule flex items-center justify-between gap-2.5">
          <h3 className="m-0 font-serif font-semibold text-[18px]">All events</h3>
          <div className="flex border border-rule rounded-md overflow-hidden">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-[5px] text-[12.5px] border-none ${filter===f ? "bg-ink text-[#f7f2ec]" : "bg-transparent text-ink-2"}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="p-[18px]">
          <div className="audit">
            {ALL_EVENTS.map((e, i) => (
              <div key={i} className="ev">
                <div className="t">{e.t}</div>
                <div className="dot"/>
                <div className="what text-[12.5px]">
                  <b>{e.who}</b> {e.action} <b>{e.target}</b>
                  {e.reason && <div className="text-ink-3 text-[11.5px] mt-0.5 italic">Reason: {e.reason}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
