"use client";
import { useState } from "react";
import { PageHead } from "@/components/page-head";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { STUDENTS } from "@/lib/data";
import { computeAverages, gradeFor } from "@/lib/utils";
import type { AppUser } from "@/lib/types";

export function StudentsScreen({ user, goto }: { user: AppUser; goto: (r: string) => void }) {
  const p = user.perms;
  const [q, setQ] = useState("");
  const base = p.allClasses ? STUDENTS : STUDENTS.filter((s) => user.assignedClasses.includes(s.class));
  const classOptions = ["All", ...Array.from(new Set(base.map((s) => s.class)))];
  const [cls, setCls] = useState("All");
  const list = base.filter((s) => {
    const matchQ = !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.admission.toLowerCase().includes(q.toLowerCase());
    const matchC = cls === "All" || s.class === cls;
    return matchQ && matchC;
  });
  const ranked = [...STUDENTS].sort((a, b) => computeAverages(b.marks).yearly - computeAverages(a.marks).yearly);

  return (
    <div className="p-7 pb-16 max-w-[1400px]">
      <PageHead
        title="Students"
        sub={p.allClasses ? "Kindergarten through Grade 12 · 248 active, 6 archived" : `Scoped to: ${user.assignedClasses.join(", ")}`}
        actions={p.admin ? (
          <>
            <button className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-rule bg-paper-2 text-ink text-[13px] hover:bg-paper-3"><Icon name="download" size={14}/> Export CSV</button>
            <button className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2"><Icon name="plus" size={14}/> New student</button>
          </>
        ) : undefined}
      />

      <div className="bg-paper-2 border border-rule rounded-lg mb-3.5">
        <div className="flex gap-3 items-center p-3.5">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-paper border border-rule rounded-md w-[340px] text-ink-3">
            <Icon name="search" size={14}/>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or admission number…" className="border-none bg-transparent outline-none w-full text-[13px] text-ink placeholder:text-ink-3"/>
          </div>
          <div className="flex border border-rule rounded-md overflow-hidden">
            {classOptions.map((c) => (
              <button key={c} onClick={() => setCls(c)} className={`px-3 py-1.5 text-[12.5px] ${cls===c ? "bg-ink text-[#f7f2ec]" : "bg-paper-2 text-ink-2"}`}>{c}</button>
            ))}
          </div>
          <div className="flex-1"/>
          <Chip>{list.length} students</Chip>
        </div>
      </div>

      <div className="bg-paper-2 border border-rule rounded-lg">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="px-3.5 py-2.5 w-[34px] bg-paper-2 border-b border-rule-2"><input type="checkbox" className="accent-wine"/></th>
              {["Name","Admission #","Class","Parent / Guardian","Contact","Yearly Avg","Rank",""].map((h) => (
                <th key={h} className="px-3.5 py-2.5 text-left font-medium text-ink-3 text-[11.5px] uppercase tracking-[.08em] bg-paper-2 border-b border-rule-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((s) => {
              const c = computeAverages(s.marks);
              const rank = ranked.findIndex((x) => x.id === s.id) + 1;
              return (
                <tr key={s.id} onClick={() => goto("reports")} className="cursor-pointer hover:bg-paper-2 border-b border-rule-2">
                  <td className="px-3.5 py-2.5" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="accent-wine"/></td>
                  <td className="px-3.5 py-2.5">
                    <div className="flex gap-2.5 items-center">
                      <div className="w-7 h-7 rounded-full bg-wine-soft text-wine flex items-center justify-center font-semibold text-[11px]">
                        {s.name.split(" ").map((p) => p[0]).slice(0,2).join("")}
                      </div>
                      <div><div className="font-medium">{s.name}</div><div className="text-[11px] text-ink-3">{s.id}</div></div>
                    </div>
                  </td>
                  <td className="px-3.5 py-2.5 font-mono">{s.admission}</td>
                  <td className="px-3.5 py-2.5"><Chip>{s.class}</Chip></td>
                  <td className="px-3.5 py-2.5">{s.guardian}</td>
                  <td className="px-3.5 py-2.5 font-mono text-[12px]">{s.contact}</td>
                  <td className="px-3.5 py-2.5">
                    <span className="font-semibold">{c.yearly.toFixed(1)}</span>
                    <span className="text-ink-3 text-[11px] ml-1">{gradeFor(c.yearly)}</span>
                  </td>
                  <td className="px-3.5 py-2.5"><Chip kind={rank<=3?"ok":""}># {rank}</Chip></td>
                  <td className="px-3.5 py-2.5">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <button className="p-1.5 rounded-md border border-rule text-[12px] hover:bg-paper-3"><Icon name="edit" size={12}/></button>
                      <button className="p-1.5 rounded-md border border-rule text-[12px] hover:bg-paper-3"><Icon name="report" size={12}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
