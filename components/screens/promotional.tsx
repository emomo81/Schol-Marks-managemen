"use client";
import { useState } from "react";
import { PageHead } from "@/components/page-head";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { STUDENTS } from "@/lib/data";
import { computeAverages, gradeFor } from "@/lib/utils";
import type { AppUser } from "@/lib/types";

type Decision = "promoted" | "retained" | "conditioned";

export function PromotionalScreen({ user }: { user: AppUser }) {
  const p = user.perms;
  const readonly = p.viewPromo === "own";
  const base = p.allClasses ? STUDENTS : STUDENTS.filter((s) => user.assignedClasses.includes(s.class));

  const [decisions, setDecisions] = useState<Record<string, Decision>>(() => {
    const o: Record<string, Decision> = {};
    base.forEach((s) => {
      const y = computeAverages(s.marks).yearly;
      o[s.id] = y >= 75 ? "promoted" : y >= 70 ? "conditioned" : "retained";
    });
    return o;
  });

  const setD = (id: string, d: Decision) => { if (!readonly) setDecisions((prev) => ({ ...prev, [id]: d })); };
  const counts = { promoted: 0, conditioned: 0, retained: 0 };
  Object.values(decisions).forEach((d) => counts[d]++);

  return (
    <div className="p-7 pb-16 max-w-[1400px]">
      <PageHead
        title="Promotional Statements"
        sub={readonly ? `Read-only · class sponsor sees decisions for ${user.assignedClasses.join(", ")} · only Principal finalizes` : "Auto-suggested by yearly average · Principal finalization required"}
        actions={<>
          <button className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-rule bg-paper-2 text-ink text-[13px] hover:bg-paper-3"><Icon name="download" size={14}/> Export batch PDF</button>
          {!readonly && p.canFinalize && (
            <button className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2"><Icon name="check" size={14}/> Finalize & sign all</button>
          )}
        </>}
      />

      <div className="grid grid-cols-4 gap-3.5 mb-[22px]">
        <KpiCard color="ok"   label="Promoted"          val={String(counts.promoted)}   meta="Avg ≥ 75"/>
        <KpiCard color="warn" label="Conditioned"        val={String(counts.conditioned)} meta="Avg 70–74"/>
        <KpiCard color="err"  label="Retained"           val={String(counts.retained)}   meta="Avg below 70"/>
        <KpiCard color="wine" label="Awaiting sign-off"  val={String(base.length)}       meta="Principal signature"/>
      </div>

      <div className="bg-paper-2 border border-rule rounded-lg">
        <div className="px-[18px] py-3.5 border-b border-rule flex items-center justify-between">
          <h3 className="m-0 font-serif font-semibold text-[18px]">{user.assignedClasses[0]} · Promotional decisions</h3>
          <div className="flex gap-1.5">
            <Chip kind="ok" dot>A — Promoted</Chip>
            <Chip kind="warn" dot>C — Conditioned</Chip>
            <Chip kind="err" dot>B — Retained</Chip>
          </div>
        </div>
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {["Student","Yearly Avg","Grade","Suggested","Decision",null,null,"Sign"].map((h, i) => (
                <th key={i} className="px-3.5 py-2.5 text-left font-medium text-ink-3 text-[11.5px] uppercase tracking-[.08em] bg-paper-2 border-b border-rule-2">
                  {h}{h==="Decision" && readonly && <span className="text-[10px] text-ink-3 ml-1.5">(view only)</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {base.map((s) => {
              const y = computeAverages(s.marks).yearly;
              const d = decisions[s.id];
              return (
                <tr key={s.id} className="hover:bg-paper-2 border-b border-rule-2">
                  <td className="px-3.5 py-2.5">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-[11px] text-ink-3">{s.admission}</div>
                  </td>
                  <td className="px-3.5 py-2.5 font-mono font-semibold">{y.toFixed(1)}</td>
                  <td className="px-3.5 py-2.5">{gradeFor(y)}</td>
                  <td className="px-3.5 py-2.5">
                    {y>=75 ? <Chip kind="ok">→ Grade 1</Chip> : y>=70 ? <Chip kind="warn">Condition</Chip> : <Chip kind="err">Retain KG</Chip>}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <button disabled={readonly} onClick={() => setD(s.id,"promoted")} className={`px-2.5 py-1 text-[12px] rounded-md border mr-1 ${d==="promoted" ? "border-wine bg-wine text-[#fdf5e6]" : "border-rule bg-paper-2 hover:bg-paper-3"} disabled:opacity-50`}>A · Promote</button>
                  </td>
                  <td className="px-3.5 py-2.5">
                    <button disabled={readonly} onClick={() => setD(s.id,"retained")} className={`px-2.5 py-1 text-[12px] rounded-md border mr-1 ${d==="retained" ? "border-wine bg-wine text-[#fdf5e6]" : "border-rule bg-paper-2 hover:bg-paper-3"} disabled:opacity-50`}>B · Retain</button>
                  </td>
                  <td className="px-3.5 py-2.5">
                    <button disabled={readonly} onClick={() => setD(s.id,"conditioned")} className={`px-2.5 py-1 text-[12px] rounded-md border ${d==="conditioned" ? "border-wine bg-wine text-[#fdf5e6]" : "border-rule bg-paper-2 hover:bg-paper-3"} disabled:opacity-50`}>C · Condition</button>
                  </td>
                  <td className="px-3.5 py-2.5">
                    {p.canFinalize
                      ? <button className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] rounded-md border border-transparent text-ink-2 hover:bg-paper-3"><Icon name="edit" size={12}/> Sign</button>
                      : <span className="text-ink-3 text-[11.5px]">Principal only</span>}
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

function KpiCard({ color, label, val, meta }: { color: string; label: string; val: string; meta: string }) {
  const colorMap: Record<string, string> = { wine:"#7a1d2e", ok:"#2f6b46", warn:"#a96a13", err:"#b3322c" };
  return (
    <div className="relative bg-paper-2 border border-rule rounded-lg p-4 overflow-hidden">
      <div className="absolute top-0 left-0 h-[3px] w-full" style={{ background: colorMap[color] }}/>
      <div className="text-[11.5px] text-ink-3 uppercase tracking-[.1em]">{label}</div>
      <div className="font-serif text-[34px] font-semibold mt-1.5 text-ink">{val}</div>
      <div className="text-[12px] text-ink-2 mt-0.5">{meta}</div>
    </div>
  );
}
