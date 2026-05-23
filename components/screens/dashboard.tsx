"use client";
import { PageHead } from "@/components/page-head";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { AUDIT, STUDENTS, SUBJECTS_K } from "@/lib/data";
import { computeAverages, gradeFor } from "@/lib/utils";
import type { AppUser } from "@/lib/types";

export function DashboardScreen({ user, goto }: { user: AppUser; goto: (r: string) => void }) {
  const p = user.perms;
  if (p.admin) return <AdminDashboard user={user} goto={goto} />;
  if (p.teacher) return <TeacherDashboard user={user} goto={goto} />;
  if (p.sponsor) return <SponsorDashboard user={user} goto={goto} />;
  return <AdminDashboard user={user} goto={goto} />;
}

function AdminDashboard({ user, goto }: { user: AppUser; goto: (r: string) => void }) {
  const greeting = user.role.startsWith("Principal")
    ? "Good afternoon, Principal Johnson"
    : "Good afternoon, Mrs. Tarr";
  const kpis = [
    { label: "Students enrolled",       val: "248",  meta: <><span className="text-ok">▲ 12</span> vs last year</> },
    { label: "Active classes",          val: "14",   meta: "KG through Grade 12" },
    { label: "Marks awaiting review",   val: "36",   meta: "3rd Period · 4 teachers" },
    { label: "Class avg (3rd Pd)",      val: "82.4", meta: <><span className="text-ok">▲ 1.8</span> vs 2nd Period</> },
  ];
  return (
    <div className="p-7 pb-16 max-w-[1400px]">
      <PageHead
        title={greeting}
        sub="Academic Year 2024–2025 · 3rd Period mark review in progress"
        actions={<>
          <button className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-rule bg-paper-2 text-ink text-[13px] hover:bg-paper-3">
            <Icon name="download" size={14}/> Export term summary
          </button>
          <button onClick={() => goto("entry")} className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2">
            <Icon name="arrow" size={14}/> Review mark entry
          </button>
        </>}
      />

      <div className="grid grid-cols-4 gap-3.5 mb-[22px]">
        {kpis.map((k, i) => (
          <div key={i} className="relative bg-paper-2 border border-rule rounded-lg p-4 overflow-hidden">
            <div className="absolute top-0 left-0 h-[3px] w-full bg-wine"/>
            <div className="text-[11.5px] text-ink-3 uppercase tracking-[.1em]">{k.label}</div>
            <div className="font-serif text-[34px] font-semibold mt-1.5 text-ink">{k.val}</div>
            <div className="text-[12px] text-ink-2 mt-0.5">{k.meta}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-[18px] mb-[18px]" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div className="bg-paper-2 border border-rule rounded-lg">
          <div className="px-[18px] py-3.5 border-b border-rule flex items-center justify-between gap-2.5">
            <h3 className="m-0 font-serif font-semibold text-[18px]">Mark submissions awaiting approval</h3>
            <button className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] rounded-md border border-transparent bg-transparent text-ink-2 hover:bg-paper-3">View all</button>
          </div>
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["Class","Subject","Period","Teacher","Submitted","Status",""].map((h) => (
                  <th key={h} className="px-3.5 py-2.5 text-left font-medium text-ink-3 text-[11.5px] uppercase tracking-[.08em] bg-paper-2 border-b border-rule-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-paper-2 border-b border-rule-2">
                <td className="px-3.5 py-2.5">KG-A</td><td className="px-3.5 py-2.5">Mathematics</td><td className="px-3.5 py-2.5">3rd Pd</td><td className="px-3.5 py-2.5">Mr. Cooper</td>
                <td className="px-3.5 py-2.5 font-mono">11:08</td>
                <td className="px-3.5 py-2.5"><Chip kind="warn" dot>Pending VPA</Chip></td>
                <td className="px-3.5 py-2.5"><button className="px-2.5 py-1 text-[12px] rounded-md border border-rule bg-paper-2 hover:bg-paper-3">Review</button></td>
              </tr>
              <tr className="hover:bg-paper-2 border-b border-rule-2">
                <td className="px-3.5 py-2.5">KG-A</td><td className="px-3.5 py-2.5">Phonics</td><td className="px-3.5 py-2.5">3rd Pd</td><td className="px-3.5 py-2.5">Mr. Cooper</td>
                <td className="px-3.5 py-2.5 font-mono">11:04</td>
                <td className="px-3.5 py-2.5"><Chip kind="warn" dot>Pending VPA</Chip></td>
                <td className="px-3.5 py-2.5"><button className="px-2.5 py-1 text-[12px] rounded-md border border-rule bg-paper-2 hover:bg-paper-3">Review</button></td>
              </tr>
              <tr className="hover:bg-paper-2 border-b border-rule-2">
                <td className="px-3.5 py-2.5">Grade 3-B</td><td className="px-3.5 py-2.5">English</td><td className="px-3.5 py-2.5">3rd Pd</td><td className="px-3.5 py-2.5">Ms. Wleh</td>
                <td className="px-3.5 py-2.5 font-mono">Yesterday</td>
                <td className="px-3.5 py-2.5"><Chip kind="ok" dot>VPA approved</Chip></td>
                <td className="px-3.5 py-2.5"><button className="px-2.5 py-1 text-[12px] rounded-md border border-wine bg-wine text-[#fdf5e6] hover:bg-wine-2">{user.perms.canFinalize ? "Finalize" : "Reviewed"}</button></td>
              </tr>
              <tr className="hover:bg-paper-2 border-b border-rule-2">
                <td className="px-3.5 py-2.5">Grade 5-A</td><td className="px-3.5 py-2.5">Science</td><td className="px-3.5 py-2.5">3rd Pd</td><td className="px-3.5 py-2.5">Mr. Bility</td>
                <td className="px-3.5 py-2.5 font-mono">Yesterday</td>
                <td className="px-3.5 py-2.5"><Chip kind="ok" dot>VPA approved</Chip></td>
                <td className="px-3.5 py-2.5"><button className="px-2.5 py-1 text-[12px] rounded-md border border-wine bg-wine text-[#fdf5e6] hover:bg-wine-2">{user.perms.canFinalize ? "Finalize" : "Reviewed"}</button></td>
              </tr>
              <tr className="hover:bg-paper-2">
                <td className="px-3.5 py-2.5">Grade 7</td><td className="px-3.5 py-2.5">S. Studies</td><td className="px-3.5 py-2.5">3rd Pd</td><td className="px-3.5 py-2.5">Mrs. Kollie</td>
                <td className="px-3.5 py-2.5 font-mono">May 18</td>
                <td className="px-3.5 py-2.5"><Chip kind="err" dot>Returned</Chip></td>
                <td className="px-3.5 py-2.5"><button className="px-2.5 py-1 text-[12px] rounded-md border border-rule bg-paper-2 hover:bg-paper-3">Open</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-paper-2 border border-rule rounded-lg">
          <div className="px-[18px] py-3.5 border-b border-rule"><h3 className="m-0 font-serif font-semibold text-[18px]">Period timeline</h3></div>
          <div className="p-[18px]"><PeriodTimeline /></div>
        </div>
      </div>

      <div className="grid gap-[18px]" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div className="bg-paper-2 border border-rule rounded-lg">
          <div className="px-[18px] py-3.5 border-b border-rule"><h3 className="m-0 font-serif font-semibold text-[18px]">Class averages — 3rd Period</h3></div>
          <div className="p-[18px]">
            <div className="bars">
              {[["KG-A",84],["KG-B",81],["Grade 1",79],["Grade 2",82],["Grade 3-A",86],["Grade 3-B",78],["Grade 5-A",88],["Grade 7",76]].map(([n,v]) => (
                <div key={n} className="bar-row">
                  <div className="text-ink-2">{n}</div>
                  <div className="track"><div className="fill" style={{width:`${v}%`}}/></div>
                  <div className="font-mono text-right text-ink">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-paper-2 border border-rule rounded-lg">
          <div className="px-[18px] py-3.5 border-b border-rule"><h3 className="m-0 font-serif font-semibold text-[18px]">Recent activity</h3></div>
          <div className="p-[18px]">
            <div className="audit">
              {AUDIT.slice(0,5).map((e, i) => (
                <div key={i} className="ev">
                  <div className="t">{e.t}</div>
                  <div className="dot"/>
                  <div className="what text-[12.5px]">
                    <b>{e.who}</b> {e.action} <b>{e.target}</b>
                    {e.reason && <div className="text-ink-3 text-[11.5px] mt-0.5 italic">"{e.reason}"</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherDashboard({ user, goto }: { user: AppUser; goto: (r: string) => void }) {
  const assignments: { c: string; s: string }[] = [];
  user.assignedClasses.forEach((c) => user.assignedSubjects.forEach((s) => assignments.push({ c, s })));
  const totalStudents = STUDENTS.filter((st) => user.assignedClasses.includes(st.class)).length;
  const statusFor = (i: number) => i < 2 ? "approved" : i < 4 ? "pending" : i < 5 ? "returned" : "draft";

  return (
    <div className="p-7 pb-16 max-w-[1400px]">
      <PageHead
        title={`Welcome back, ${user.name}`}
        sub="Enter marks for your assigned class × subject pairs · submit to VPA when ready"
        actions={
          <button onClick={() => goto("entry")} className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2">
            <Icon name="entry" size={14}/> Open mark entry
          </button>
        }
      />
      <div className="grid grid-cols-4 gap-3.5 mb-[22px]">
        <div className="relative bg-paper-2 border border-rule rounded-lg p-4 overflow-hidden"><div className="absolute top-0 left-0 h-[3px] w-full bg-wine"/><div className="text-[11.5px] text-ink-3 uppercase tracking-[.1em]">Your classes</div><div className="font-serif text-[34px] font-semibold mt-1.5 text-ink">{user.assignedClasses.length}</div><div className="text-[12px] text-ink-2">{user.assignedClasses.join(", ")}</div></div>
        <div className="relative bg-paper-2 border border-rule rounded-lg p-4 overflow-hidden"><div className="absolute top-0 left-0 h-[3px] w-full bg-wine"/><div className="text-[11.5px] text-ink-3 uppercase tracking-[.1em]">Your subjects</div><div className="font-serif text-[34px] font-semibold mt-1.5 text-ink">{user.assignedSubjects.length}</div><div className="text-[12px] text-ink-2">{user.assignedSubjects.join(" · ")}</div></div>
        <div className="relative bg-paper-2 border border-rule rounded-lg p-4 overflow-hidden"><div className="absolute top-0 left-0 h-[3px] w-full bg-wine"/><div className="text-[11.5px] text-ink-3 uppercase tracking-[.1em]">Students taught</div><div className="font-serif text-[34px] font-semibold mt-1.5 text-ink">{totalStudents}</div><div className="text-[12px] text-ink-2">Across your classes</div></div>
        <div className="relative bg-paper-2 border border-rule rounded-lg p-4 overflow-hidden"><div className="absolute top-0 left-0 h-[3px] w-full bg-warn"/><div className="text-[11.5px] text-ink-3 uppercase tracking-[.1em]">Awaiting submission</div><div className="font-serif text-[34px] font-semibold mt-1.5 text-ink">3</div><div className="text-[12px] text-ink-2">3rd Period · due Friday</div></div>
      </div>
      <div className="bg-paper-2 border border-rule rounded-lg mb-[18px]">
        <div className="px-[18px] py-3.5 border-b border-rule flex items-center justify-between">
          <h3 className="m-0 font-serif font-semibold text-[18px]">Your assignments — 3rd Period</h3>
          <Chip kind="warn" dot>Window closes Friday 5pm</Chip>
        </div>
        <table className="w-full border-collapse text-[13px]">
          <thead><tr>{["Class","Subject","Students","Entered","Status",""].map((h) => <th key={h} className="px-3.5 py-2.5 text-left font-medium text-ink-3 text-[11.5px] uppercase tracking-[.08em] bg-paper-2 border-b border-rule-2">{h}</th>)}</tr></thead>
          <tbody>
            {assignments.map((a, i) => {
              const stCount = STUDENTS.filter((st) => st.class === a.c).length;
              const status = statusFor(i);
              const entered = status === "draft" ? Math.floor(stCount / 2) : stCount;
              return (
                <tr key={i} onClick={() => goto("entry")} className="cursor-pointer hover:bg-paper-2 border-b border-rule-2">
                  <td className="px-3.5 py-2.5"><Chip>{a.c}</Chip></td>
                  <td className="px-3.5 py-2.5 font-serif font-medium text-[15px]">{a.s}</td>
                  <td className="px-3.5 py-2.5 font-mono">{stCount}</td>
                  <td className="px-3.5 py-2.5 font-mono">{entered} / {stCount}</td>
                  <td className="px-3.5 py-2.5">
                    {status==="approved" && <Chip kind="ok" dot>VPA approved · locked</Chip>}
                    {status==="pending"  && <Chip kind="warn" dot>Pending VPA review</Chip>}
                    {status==="returned" && <Chip kind="err" dot>Returned — needs fix</Chip>}
                    {status==="draft"    && <Chip dot>Draft · auto-saving</Chip>}
                  </td>
                  <td className="px-3.5 py-2.5"><button className="px-2.5 py-1 text-[12px] rounded-md border border-rule bg-paper-2 hover:bg-paper-3">{status==="draft" ? "Continue" : "Open"}</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SponsorDashboard({ user, goto }: { user: AppUser; goto: (r: string) => void }) {
  const klass = user.assignedClasses[0];
  const classStudents = STUDENTS.filter((s) => s.class === klass);
  const avgs = classStudents.map((s) => computeAverages(s.marks).yearly);
  const classAvg = avgs.reduce((a, b) => a + b, 0) / avgs.length;
  const promote = avgs.filter((a) => a >= 75).length;

  return (
    <div className="p-7 pb-16 max-w-[1400px]">
      <PageHead
        title={`${klass} · Class Sponsor View`}
        sub={`You are the sponsor for ${klass} — review marks, sign off per period, export and distribute report cards`}
        actions={<>
          <button className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-rule bg-paper-2 text-ink text-[13px] hover:bg-paper-3">
            <Icon name="download" size={14}/> Export all report cards
          </button>
          <button onClick={() => goto("entry")} className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2">
            <Icon name="arrow" size={14}/> Review class marks
          </button>
        </>}
      />
      <div className="grid grid-cols-4 gap-3.5 mb-[22px]">
        <div className="relative bg-paper-2 border border-rule rounded-lg p-4 overflow-hidden"><div className="absolute top-0 left-0 h-[3px] w-full bg-wine"/><div className="text-[11.5px] text-ink-3 uppercase tracking-[.1em]">Students in class</div><div className="font-serif text-[34px] font-semibold mt-1.5 text-ink">{classStudents.length}</div><div className="text-[12px] text-ink-2">{klass}</div></div>
        <div className="relative bg-paper-2 border border-rule rounded-lg p-4 overflow-hidden"><div className="absolute top-0 left-0 h-[3px] w-full bg-wine"/><div className="text-[11.5px] text-ink-3 uppercase tracking-[.1em]">Class yearly avg</div><div className="font-serif text-[34px] font-semibold mt-1.5 text-ink">{classAvg.toFixed(1)}</div><div className="text-[12px] text-ink-2">Across {SUBJECTS_K.length} subjects</div></div>
        <div className="relative bg-paper-2 border border-rule rounded-lg p-4 overflow-hidden"><div className="absolute top-0 left-0 h-[3px] w-full bg-ok"/><div className="text-[11.5px] text-ink-3 uppercase tracking-[.1em]">Suggested promote</div><div className="font-serif text-[34px] font-semibold mt-1.5 text-ink">{promote}</div><div className="text-[12px] text-ink-2">{Math.round(promote/classStudents.length*100)}% of class</div></div>
        <div className="relative bg-paper-2 border border-rule rounded-lg p-4 overflow-hidden"><div className="absolute top-0 left-0 h-[3px] w-full bg-warn"/><div className="text-[11.5px] text-ink-3 uppercase tracking-[.1em]">Periods awaiting sign-off</div><div className="font-serif text-[34px] font-semibold mt-1.5 text-ink">1</div><div className="text-[12px] text-ink-2">3rd Period · VPA approved</div></div>
      </div>
      <div className="grid gap-[18px]" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div className="bg-paper-2 border border-rule rounded-lg">
          <div className="px-[18px] py-3.5 border-b border-rule"><h3 className="m-0 font-serif font-semibold text-[18px]">Top students — {klass}</h3></div>
          <table className="w-full border-collapse text-[13px]">
            <thead><tr>{["Rank","Student","Yearly","Suggested"].map((h) => <th key={h} className="px-3.5 py-2.5 text-left font-medium text-ink-3 text-[11.5px] uppercase tracking-[.08em] bg-paper-2 border-b border-rule-2">{h}</th>)}</tr></thead>
            <tbody>
              {classStudents.map((s) => ({s, y: computeAverages(s.marks).yearly})).sort((a,b) => b.y-a.y).slice(0,6).map((row, i) => (
                <tr key={row.s.id} className="hover:bg-paper-2 border-b border-rule-2">
                  <td className="px-3.5 py-2.5"><Chip kind={i<3?"ok":""}># {i+1}</Chip></td>
                  <td className="px-3.5 py-2.5 font-medium">{row.s.name}</td>
                  <td className="px-3.5 py-2.5 font-mono font-semibold">{row.y.toFixed(1)}</td>
                  <td className="px-3.5 py-2.5">{row.y>=75 ? <Chip kind="ok">Promote</Chip> : row.y>=70 ? <Chip kind="warn">Condition</Chip> : <Chip kind="err">Retain</Chip>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-paper-2 border border-rule rounded-lg">
          <div className="px-[18px] py-3.5 border-b border-rule"><h3 className="m-0 font-serif font-semibold text-[18px]">What you can do</h3></div>
          <div className="p-[18px] text-[12.5px] text-ink-2 leading-[1.7]">
            <div>· View full marks for every student in {klass}</div>
            <div>· Sign off on each period after VPA approval</div>
            <div>· Export individual or batch report cards as PDF</div>
            <div>· View (read-only) the suggested promotional decisions</div>
            <div className="mt-2.5 pt-2.5 border-t border-rule">
              <b className="text-ink">What you cannot do:</b>
              <div className="text-ink-3 mt-1">Enter or edit marks · finalize promotional decisions · manage subjects or users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PeriodTimeline() {
  const periods = [
    { n:"1st Pd", state:"done" }, { n:"2nd Pd", state:"done" }, { n:"3rd Pd", state:"active" },
    { n:"Sem 1 Exam", state:"pending" }, { n:"4th Pd", state:"pending" }, { n:"5th Pd", state:"pending" },
    { n:"6th Pd", state:"pending" }, { n:"Sem 2 Exam", state:"pending" },
  ];
  return (
    <div className="flex flex-col gap-0.5">
      {periods.map((p, i) => {
        const dotColor = p.state==="done" ? "#2f6b46" : p.state==="active" ? "#7a1d2e" : "#d9cec3";
        return (
          <div key={i} className="grid items-center gap-2.5 py-[7px]" style={{ gridTemplateColumns: "12px 1fr auto" }}>
            <div className="w-2.5 h-2.5 rounded-full ml-px" style={{ background: dotColor }}/>
            <div className={`text-[13px] ${p.state==="pending" ? "text-ink-3" : "text-ink"} ${p.state==="active" ? "font-semibold" : "font-medium"}`}>{p.n}</div>
            <div className="text-[11.5px] text-ink-3 font-mono">
              {p.state==="done" && "100% submitted"}
              {p.state==="active" && "62% submitted"}
              {p.state==="pending" && "—"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
