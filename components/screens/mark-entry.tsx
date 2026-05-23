"use client";
import { useState } from "react";
import { PageHead } from "@/components/page-head";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { STUDENTS, SUBJECTS_K } from "@/lib/data";
import type { AppUser, Student, StudentMarks } from "@/lib/types";

export function MarkEntryScreen({ user }: { user: AppUser }) {
  const p = user.perms;
  if (p.sponsor && !p.teacher && !p.admin) return <SponsorClassMarks user={user} />;

  const availableClasses = user.assignedClasses;
  const availableSubjects = p.allSubjects ? SUBJECTS_K : user.assignedSubjects;

  const [klass, setKlass] = useState(availableClasses[0]);
  const [subject, setSubject] = useState(availableSubjects[0]);
  const [students, setStudents] = useState<Student[]>(() => JSON.parse(JSON.stringify(STUDENTS)));
  const [locked, setLocked] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showOverride, setShowOverride] = useState<{ sid: string; key: keyof StudentMarks; oldVal: number | null; newVal: string } | null>(null);
  const [overrideReason, setOverrideReason] = useState("");

  const visible = students.filter((s) => s.class === klass);

  function updateMark(sid: string, key: keyof StudentMarks, val: string) {
    if (locked && !p.canOverride) return;
    if (locked && p.canOverride && !showOverride) {
      setShowOverride({ sid, key, oldVal: students.find((s) => s.id === sid)?.marks[subject][key] ?? null, newVal: val });
      return;
    }
    let n: number | null = val === "" ? null : parseInt(val, 10);
    if (n != null && (isNaN(n) || n < 0)) return;
    if (n != null && n > 100) n = 100;
    setStudents((prev) => prev.map((s) => s.id === sid
      ? { ...s, marks: { ...s.marks, [subject]: { ...s.marks[subject], [key]: n } } }
      : s
    ));
  }

  function classAvg(key: keyof StudentMarks): string {
    const xs = visible.map((s) => s.marks[subject]?.[key]).filter((v) => v != null) as number[];
    if (!xs.length) return "—";
    return (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1);
  }

  function cellClass(v: number | null, isLocked: boolean): string {
    let c = "cell-input";
    if (isLocked && !p.canOverride) c += " locked";
    if (v != null && v < 70) c += " low";
    return c;
  }

  return (
    <div className="p-7 pb-16 max-w-[1400px]">
      <PageHead
        title="Mark Entry"
        sub={p.teacher ? `You teach ${user.assignedSubjects.length} subjects across ${user.assignedClasses.length} classes · auto-saving · validates 0–100` : "Full access · any class × subject · overrides logged to audit"}
        actions={<>
          <button className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-transparent bg-transparent text-ink-2 text-[13px] hover:bg-paper-3"><Icon name="download" size={14}/> Export</button>
          <button className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-rule bg-paper-2 text-ink text-[13px] hover:bg-paper-3"><Icon name="audit" size={14}/> History</button>
          {p.teacher && !p.admin && (
            <button onClick={() => setShowSubmit(true)} className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2"><Icon name="check" size={14}/> Submit to VPA</button>
          )}
          {p.canApprove && (
            <button className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2"><Icon name="check" size={14}/> {p.canFinalize ? "Finalize period" : "Approve submission"}</button>
          )}
        </>}
      />

      <div className="bg-paper-2 border border-rule rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-rule bg-paper-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-[5px] border border-rule rounded-md bg-paper-2 text-[12.5px] text-ink-2">
            Class <b className="text-ink font-semibold ml-1">{klass}</b>
          </div>
          <div className="flex border border-rule rounded-md overflow-hidden">
            {availableClasses.map((c) => (
              <button key={c} onClick={() => setKlass(c)} className={`px-3 py-[5px] text-[12.5px] ${klass===c ? "bg-ink text-[#f7f2ec]" : "bg-paper-2 text-ink-2"}`}>{c}</button>
            ))}
          </div>
          <div className="w-px h-6 bg-rule"/>
          <div className="flex items-center gap-1.5 px-2.5 py-[5px] border border-rule rounded-md bg-paper-2 text-[12.5px] text-ink-2">
            Subject <b className="text-ink font-semibold ml-1">{subject}</b>
          </div>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="px-3 py-[5px] border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine w-[170px]">
            {availableSubjects.map((s) => <option key={s}>{s}</option>)}
          </select>
          <div className="flex-1"/>
          <Chip kind={locked ? (p.canOverride ? "warn" : "ok") : "warn"} dot>
            {locked ? (p.canOverride ? "Locked · override available" : "Approved · locked") : "Draft · auto-saving"}
          </Chip>
          <button onClick={() => setLocked(!locked)} className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] rounded-md border border-transparent bg-transparent text-ink-2 hover:bg-paper-3">
            <Icon name="lock" size={12}/> {locked ? "Unlock" : "Lock"}
          </button>
        </div>

        {/* Grid */}
        <div className="entry-scroll">
          <table className="entry-grid">
            <thead>
              <tr>
                <th className="student l" rowSpan={2}>Student</th>
                <th colSpan={5} className="semhead">First Semester</th>
                <th colSpan={6} className="semhead">Second Semester</th>
              </tr>
              <tr>
                <th>1st Pd</th><th>2nd Pd</th><th>3rd Pd</th>
                <th className="examhead">Exam</th>
                <th className="semavghead">Sem. Avg.</th>
                <th>4th Pd</th><th>5th Pd</th><th>6th Pd</th>
                <th className="examhead">Exam</th>
                <th className="semavghead">Sem. Avg.</th>
                <th className="semavghead">Yearly Avg.</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((s) => {
                const m = s.marks[subject];
                if (!m) return null;
                const sem1 = (m.p1 + m.p2 + m.p3 + m.e1) / 4;
                const sem2 = (m.p4 + m.p5 + m.p6 + m.e2) / 4;
                const yr = (sem1 + sem2) / 2;
                return (
                  <tr key={s.id}>
                    <td className="student l">
                      <div>{s.name}</div>
                      <div className="adm">{s.admission} · {s.class}</div>
                    </td>
                    {(["p1","p2","p3","e1"] as (keyof StudentMarks)[]).map((k) => (
                      <td key={k}>
                        <input className={cellClass(m[k], locked)} disabled={locked && !p.canOverride}
                          value={m[k] ?? ""} onChange={(e) => updateMark(s.id, k, e.target.value)} maxLength={3}/>
                      </td>
                    ))}
                    <td className="calc">{sem1.toFixed(1)}</td>
                    {(["p4","p5","p6","e2"] as (keyof StudentMarks)[]).map((k) => (
                      <td key={k}>
                        <input className={cellClass(m[k], locked)} disabled={locked && !p.canOverride}
                          value={m[k] ?? ""} onChange={(e) => updateMark(s.id, k, e.target.value)} maxLength={3}/>
                      </td>
                    ))}
                    <td className="calc">{sem2.toFixed(1)}</td>
                    <td className="calc yr">{yr.toFixed(1)}</td>
                  </tr>
                );
              })}
              <tr>
                <td className="student l" style={{ fontWeight:600, color:"#8a7d76", fontSize:11.5, textTransform:"uppercase", letterSpacing:".06em" }}>Class Average</td>
                {(["p1","p2","p3","e1"] as (keyof StudentMarks)[]).map((k) => <td key={k} className="calc">{classAvg(k)}</td>)}
                <td className="calc">—</td>
                {(["p4","p5","p6","e2"] as (keyof StudentMarks)[]).map((k) => <td key={k} className="calc">{classAvg(k)}</td>)}
                <td className="calc">—</td>
                <td className="calc yr">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex gap-3.5 px-4 py-2.5 bg-paper-2 border-t border-rule text-[11.5px] text-ink-3 items-center flex-wrap">
          <span><span className="inline-block w-2.5 h-2.5 rounded-sm mr-1.5 align-[-1px] bg-[#fff8f8] border border-wine"/>Focused cell</span>
          <span><span className="inline-block w-2.5 h-2.5 rounded-sm mr-1.5 align-[-1px] bg-paper-3"/>Computed</span>
          <span><span className="inline-block w-2.5 h-2.5 rounded-sm mr-1.5 align-[-1px] bg-[#e6dccf]"/>Yearly average</span>
          <span className="text-err">Red text = marks below 70</span>
          <div className="flex-1"/>
          <span>Tab / Shift+Tab to move · Enter to confirm</span>
        </div>
      </div>

      {/* Submit modal */}
      {showSubmit && (
        <div className="fixed inset-0 bg-black/45 z-50 grid place-items-center" onClick={() => setShowSubmit(false)}>
          <div className="bg-paper-2 border border-rule rounded-lg w-[520px] max-w-[90vw] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-[22px] py-[18px] pb-1.5 flex justify-between items-center">
              <h3 className="font-serif text-[22px] font-semibold m-0">Submit marks for VPA review</h3>
              <button onClick={() => setShowSubmit(false)} className="text-ink-2 hover:text-ink px-2 py-1">✕</button>
            </div>
            <div className="px-[22px] py-1.5 pb-3.5">
              <p className="text-ink-2 text-[13px] mb-3">Submitting <b>{subject} · {klass} · 3rd Period</b> for <b>{visible.length} students</b>. Once VPA approves, marks lock from teacher edits.</p>
              <div className="mb-3"><label className="block text-[12px] text-ink-2 mb-1 font-medium">Note to VPA (optional)</label>
                <textarea className="w-full px-3 py-2.5 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine rows-3 resize-none" rows={3} placeholder="e.g. Faith Nyenkan was absent for the exam — pending make-up."/>
              </div>
            </div>
            <div className="px-[22px] py-3.5 border-t border-rule flex gap-2 justify-end">
              <button onClick={() => setShowSubmit(false)} className="px-3 py-[7px] rounded-md border border-transparent text-ink-2 hover:bg-paper-3 text-[13px]">Cancel</button>
              <button onClick={() => { setShowSubmit(false); setLocked(true); }} className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2"><Icon name="check" size={14}/> Submit for review</button>
            </div>
          </div>
        </div>
      )}

      {/* Override modal */}
      {showOverride && (
        <div className="fixed inset-0 bg-black/45 z-50 grid place-items-center" onClick={() => setShowOverride(null)}>
          <div className="bg-paper-2 border border-rule rounded-lg w-[520px] max-w-[90vw] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-[22px] py-[18px] pb-1.5 flex justify-between items-center">
              <h3 className="font-serif text-[22px] font-semibold m-0">Override locked mark</h3>
              <button onClick={() => setShowOverride(null)} className="text-ink-2 hover:text-ink px-2 py-1">✕</button>
            </div>
            <div className="px-[22px] py-1.5 pb-3.5">
              <p className="text-ink-2 text-[13px] mb-3">You are overriding an approved mark. The change will be permanently logged in the audit trail.</p>
              <div className="flex gap-3.5 text-[12.5px] mb-3">
                <span>Was: <b className="font-mono">{showOverride.oldVal ?? "—"}</b></span>
                <span>→</span>
                <span>New: <b className="font-mono">{showOverride.newVal || "—"}</b></span>
              </div>
              <div><label className="block text-[12px] text-ink-2 mb-1 font-medium">Reason for override (required)</label>
                <textarea className="w-full px-3 py-2.5 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine resize-none" rows={3}
                  value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} placeholder="e.g. Re-grade after script review"/>
              </div>
            </div>
            <div className="px-[22px] py-3.5 border-t border-rule flex gap-2 justify-end">
              <button onClick={() => setShowOverride(null)} className="px-3 py-[7px] rounded-md border border-transparent text-ink-2 hover:bg-paper-3 text-[13px]">Cancel</button>
              <button disabled={!overrideReason} onClick={() => {
                const { sid, key, newVal } = showOverride;
                const n = newVal === "" ? null : parseInt(newVal, 10);
                setStudents((prev) => prev.map((s) => s.id === sid
                  ? { ...s, marks: { ...s.marks, [subject]: { ...s.marks[subject], [key]: n } } } : s));
                setShowOverride(null); setOverrideReason("");
              }} className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2 disabled:opacity-50">
                <Icon name="check" size={14}/> Save override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SponsorClassMarks({ user }: { user: AppUser }) {
  const klass = user.assignedClasses[0];
  const classStudents = STUDENTS.filter((s) => s.class === klass);
  const [signedPeriods, setSignedPeriods] = useState<Record<number, boolean>>({ 1: true, 2: true });

  return (
    <div className="p-7 pb-16 max-w-[1400px]">
      <PageHead
        title={`Class Marks — ${klass}`}
        sub="As Class Sponsor you do not enter marks — you review, sign off per period, and export the class summary"
        actions={<>
          <button className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-rule bg-paper-2 text-ink text-[13px] hover:bg-paper-3"><Icon name="download" size={14}/> Export class summary</button>
          <button className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2"><Icon name="edit" size={14}/> Sign current period</button>
        </>}
      />
      <div className="grid grid-cols-4 gap-3.5 mb-[22px]">
        <KpiCard color="wine" label="Students" val={String(classStudents.length)} meta={`${klass} roster`}/>
        <KpiCard color="wine" label="Subjects tracked" val={String(SUBJECTS_K.length)} meta="Kindergarten curriculum"/>
        <KpiCard color="ok"   label="Periods signed" val="2 / 6" meta="1st & 2nd Period"/>
        <KpiCard color="warn" label="Awaiting sign-off" val="3rd Pd" meta="VPA approved · awaiting sponsor"/>
      </div>

      <div className="bg-paper-2 border border-rule rounded-lg mb-[18px]">
        <div className="px-[18px] py-3.5 border-b border-rule flex items-center justify-between">
          <h3 className="m-0 font-serif font-semibold text-[18px]">Period sign-off ledger</h3>
          <Chip kind="warn" dot>3rd Period ready to sign</Chip>
        </div>
        <table className="w-full border-collapse text-[13px]">
          <thead><tr>{["Period","VPA Approval","Class Average","Your sign-off",""].map((h) => <th key={h} className="px-3.5 py-2.5 text-left font-medium text-ink-3 text-[11.5px] uppercase tracking-[.08em] bg-paper-2 border-b border-rule-2">{h}</th>)}</tr></thead>
          <tbody>
            {[1,2,3,4,5,6].map((pd) => (
              <tr key={pd} className="hover:bg-paper-2 border-b border-rule-2">
                <td className="px-3.5 py-2.5 font-medium">{pd}{pd===1?"st":pd===2?"nd":pd===3?"rd":"th"} Period</td>
                <td className="px-3.5 py-2.5">{pd<=3 ? <Chip kind="ok" dot>Approved</Chip> : <Chip>Not yet</Chip>}</td>
                <td className="px-3.5 py-2.5 font-mono">{pd<=3 ? (80+pd).toFixed(1) : "—"}</td>
                <td className="px-3.5 py-2.5">
                  {signedPeriods[pd] ? <span style={{ fontFamily:"cursive", fontSize:18, color:"#7a1d2e" }}>A. Wleh</span> : <span className="text-ink-3">—</span>}
                </td>
                <td className="px-3.5 py-2.5">
                  {pd<=3 && !signedPeriods[pd] && (
                    <button onClick={() => setSignedPeriods({ ...signedPeriods, [pd]: true })} className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] rounded-md border border-wine bg-wine text-[#fdf5e6] hover:bg-wine-2">
                      <Icon name="edit" size={12}/> Sign as A. Wleh
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({ color, label, val, meta }: { color: string; label: string; val: string; meta: string }) {
  const colorMap: Record<string, string> = { wine:"#7a1d2e", ok:"#2f6b46", warn:"#a96a13" };
  return (
    <div className="relative bg-paper-2 border border-rule rounded-lg p-4 overflow-hidden">
      <div className="absolute top-0 left-0 h-[3px] w-full" style={{ background: colorMap[color] ?? colorMap.wine }}/>
      <div className="text-[11.5px] text-ink-3 uppercase tracking-[.1em]">{label}</div>
      <div className="font-serif text-[34px] font-semibold mt-1.5 text-ink">{val}</div>
      <div className="text-[12px] text-ink-2 mt-0.5">{meta}</div>
    </div>
  );
}
