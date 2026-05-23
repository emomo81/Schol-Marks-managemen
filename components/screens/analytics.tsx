"use client";
import { PageHead } from "@/components/page-head";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { STUDENTS, SUBJECTS_K } from "@/lib/data";
import { computeAverages, gradeFor } from "@/lib/utils";

export function AnalyticsScreen() {
  const subjectAvgs = SUBJECTS_K.map((sub) => {
    const xs = STUDENTS.map((s) => {
      const m = s.marks[sub];
      return (m.p1+m.p2+m.p3+m.e1+m.p4+m.p5+m.p6+m.e2)/8;
    });
    return { sub, v: xs.reduce((a,b)=>a+b,0)/xs.length };
  }).sort((a,b)=>b.v-a.v);

  const passRates = subjectAvgs.map((s) => ({ ...s, pass: Math.max(0, Math.min(100, 60 + Math.floor((s.v - 75) * 5))) }));

  const topStudents = [...STUDENTS].map((s) => {
    const c = computeAverages(s.marks);
    const sem1 = c.rows.reduce((a,r)=>a+r.sem1,0)/c.rows.length;
    const sem2 = c.rows.reduce((a,r)=>a+r.sem2,0)/c.rows.length;
    return { s, sem1, sem2, y: c.yearly };
  }).sort((a,b)=>b.y-a.y).slice(0,8);

  return (
    <div className="p-7 pb-16 max-w-[1400px]">
      <PageHead
        title="Analytics"
        sub="Class- and school-level performance · Academic 2024–2025"
        actions={<button className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-rule bg-paper-2 text-ink text-[13px] hover:bg-paper-3"><Icon name="download" size={14}/> Export XLSX</button>}
      />

      <div className="grid grid-cols-4 gap-3.5 mb-[22px]">
        {[
          { color:"wine", label:"School avg",       val:"82.1",   meta:<><span className="text-ok">▲ 2.4</span> vs prior year</> },
          { color:"wine", label:"Pass rate (≥70)",  val:"94%",    meta:"236 of 248 students" },
          { color:"wine", label:"Top subject",       val:"Phonics",meta:"Class avg 87.3" },
          { color:"warn", label:"Needs focus",       val:"Writing",meta:"Class avg 75.8" },
        ].map(({ color, label, val, meta }, i) => (
          <div key={i} className="relative bg-paper-2 border border-rule rounded-lg p-4 overflow-hidden">
            <div className="absolute top-0 left-0 h-[3px] w-full" style={{ background: color==="warn" ? "#a96a13" : "#7a1d2e" }}/>
            <div className="text-[11.5px] text-ink-3 uppercase tracking-[.1em]">{label}</div>
            <div className={`font-serif ${typeof val==="string" && val.length>5 ? "text-[24px]" : "text-[34px]"} font-semibold mt-1.5 text-ink`}>{val}</div>
            <div className="text-[12px] text-ink-2 mt-0.5">{meta}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-[18px] mb-[18px]" style={{ gridTemplateColumns:"2fr 1fr" }}>
        <div className="bg-paper-2 border border-rule rounded-lg">
          <div className="px-[18px] py-3.5 border-b border-rule"><h3 className="m-0 font-serif font-semibold text-[18px]">Subject averages — KG-A</h3></div>
          <div className="p-[18px]">
            <div className="bars">
              {subjectAvgs.slice(0,12).map((s) => (
                <div key={s.sub} className="bar-row">
                  <div className="text-ink-2">{s.sub}</div>
                  <div className="track"><div className="fill" style={{ width:`${s.v}%` }}/></div>
                  <div className="font-mono text-right text-ink">{s.v.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-paper-2 border border-rule rounded-lg">
          <div className="px-[18px] py-3.5 border-b border-rule"><h3 className="m-0 font-serif font-semibold text-[18px]">Pass rates</h3></div>
          <div className="p-[18px]">
            <div className="bars">
              {passRates.slice(0,8).map((s) => (
                <div key={s.sub} className="bar-row">
                  <div className="text-ink-2">{s.sub}</div>
                  <div className="track"><div className="fill" style={{ width:`${s.pass}%`, background: s.pass>85 ? "#2f6b46" : "#a96a13" }}/></div>
                  <div className="font-mono text-right text-ink">{s.pass}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-paper-2 border border-rule rounded-lg">
        <div className="px-[18px] py-3.5 border-b border-rule"><h3 className="m-0 font-serif font-semibold text-[18px]">Top performers — KG-A</h3></div>
        <table className="w-full border-collapse text-[13px]">
          <thead><tr>{["Rank","Student","Sem 1","Sem 2","Yearly Avg","Grade","Suggested promotion"].map((h) => (
            <th key={h} className="px-3.5 py-2.5 text-left font-medium text-ink-3 text-[11.5px] uppercase tracking-[.08em] bg-paper-2 border-b border-rule-2">{h}</th>
          ))}</tr></thead>
          <tbody>
            {topStudents.map((row, i) => (
              <tr key={row.s.id} className="hover:bg-paper-2 border-b border-rule-2">
                <td className="px-3.5 py-2.5"><Chip kind={i<3?"ok":""}># {i+1}</Chip></td>
                <td className="px-3.5 py-2.5 font-medium">{row.s.name}</td>
                <td className="px-3.5 py-2.5 font-mono">{row.sem1.toFixed(1)}</td>
                <td className="px-3.5 py-2.5 font-mono">{row.sem2.toFixed(1)}</td>
                <td className="px-3.5 py-2.5 font-mono font-semibold">{row.y.toFixed(1)}</td>
                <td className="px-3.5 py-2.5">{gradeFor(row.y)}</td>
                <td className="px-3.5 py-2.5"><Chip kind="ok">→ Grade 1</Chip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
