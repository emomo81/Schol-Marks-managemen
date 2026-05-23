"use client";
import { useState } from "react";
import Image from "next/image";
import { PageHead } from "@/components/page-head";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { STUDENTS, GRADING_SCALE } from "@/lib/data";
import { computeAverages, fmt } from "@/lib/utils";
import type { Student } from "@/lib/types";

const SIGS = [
  { pd:"1st Pd", parent:"F. Konneh", sponsor:"M. Tarr" },
  { pd:"2nd Pd", parent:"F. Konneh", sponsor:"M. Tarr" },
  { pd:"3rd Pd", parent:"", sponsor:"" },
  { pd:"4th Pd", parent:"", sponsor:"" },
  { pd:"5th Pd", parent:"", sponsor:"" },
  { pd:"6th Pd", parent:"", sponsor:"" },
];

export function ReportCardScreen() {
  const [student, setStudent] = useState<Student>(STUDENTS[0]);
  const [decision, setDecision] = useState<"A"|"B"|"C">("A");

  const s = student;
  const c = computeAverages(s.marks);
  const sem1Avg = c.rows.reduce((a, r) => a + r.sem1, 0) / c.rows.length;
  const sem2Avg = c.rows.reduce((a, r) => a + r.sem2, 0) / c.rows.length;
  const ranked = [...STUDENTS].sort((a, b) => computeAverages(b.marks).yearly - computeAverages(a.marks).yearly);
  const rank = ranked.findIndex((x) => x.id === s.id) + 1;

  return (
    <div className="p-7 pb-16 max-w-[1400px]">
      <PageHead
        title="Report Card"
        sub={`${s.name} · ${s.admission} · ${s.class} · Academic 2024–2025`}
        actions={<>
          <button className="no-print inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-rule bg-paper-2 text-ink text-[13px] hover:bg-paper-3"><Icon name="audit" size={14}/> History</button>
          <button onClick={() => window.print()} className="no-print inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-rule bg-paper-2 text-ink text-[13px] hover:bg-paper-3"><Icon name="print" size={14}/> Print</button>
          <button className="no-print inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2"><Icon name="download" size={14}/> Download PDF</button>
        </>}
      />

      {/* Student selector */}
      <div className="no-print flex items-center gap-4 px-5 py-3.5 bg-paper-2 border border-rule rounded-lg mb-5 text-[13px]">
        <div className="flex items-center gap-2">
          <b>Student</b>
          <select className="ml-2 px-3 py-2 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine min-w-[200px]"
            value={s.id} onChange={(e) => setStudent(STUDENTS.find((x) => x.id === e.target.value) ?? STUDENTS[0])}>
            {STUDENTS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        </div>
        <div className="text-ink-2"><b className="text-ink">Yearly Avg.</b> <span className="font-mono font-semibold">{c.yearly.toFixed(1)}</span></div>
        <div className="text-ink-2"><b className="text-ink">Class Rank</b> #{rank} of {STUDENTS.length}</div>
        <div className="text-ink-2"><b className="text-ink">Status</b> <Chip kind="ok" dot>Approved</Chip></div>
      </div>

      {/* Front of card */}
      <div className="rc-paper">
        <div className="rc-spread">
          {/* LEFT — Promotional Statement */}
          <div className="rc-panel">
            <div className="text-center font-bold tracking-[.06em] uppercase font-sans text-[13px]">Promotional Statement</div>
            <div className="text-center font-bold mt-3.5 font-sans text-[13px] uppercase tracking-[.04em]">This testifies that student</div>
            <div className="text-center border-b-[1.5px] border-[#2a1a1d] py-1 mx-0 my-2 font-semibold text-[16px]">{s.name}</div>
            <div className="text-[13px] leading-[1.6] font-sans font-semibold uppercase tracking-[.03em]">
              Has/has not successfully completed the academic work of{" "}
              <span className="underline font-bold px-1">Kindergarten</span> and is/is not:
            </div>

            {(["A","B","C"] as const).map((opt) => (
              <div key={opt} onClick={() => setDecision(opt)} className={`rc-prom-option ${decision===opt ? "active" : ""}`}>
                <span className="radio"/>
                <span>{opt === "A" ? "A. Promoted to Grade:" : opt === "B" ? "B. Retained in Grade:" : "C. Conditioned in:"}</span>
                <span className="v">{decision===opt ? (opt==="A" ? "Grade 1" : opt==="B" ? "Kindergarten" : "Mathematics") : ""}</span>
              </div>
            ))}

            <div className="mt-7 text-center font-sans text-[12px] font-bold tracking-[.04em]">
              <div>Signed:</div>
              <div className="border-b-[1.5px] border-[#2a1a1d] px-3 pb-0.5 mx-auto my-1.5 w-[75%]" style={{ fontFamily:"cursive", fontWeight:400, fontSize:18, color:"#2a1a3a" }}>M. Tarr</div>
              <div>Sponsor</div>
            </div>
            <div className="mt-[18px] text-center font-sans text-[12px] font-bold tracking-[.04em]">
              <div>Approved:</div>
              <div className="border-b-[1.5px] border-[#2a1a1d] px-3 pb-0.5 mx-auto my-1.5 w-[75%]" style={{ fontFamily:"cursive", fontWeight:400, fontSize:18, color:"#2a1a3a" }}>J. Johnson</div>
              <div>Principal</div>
            </div>
            <div className="flex gap-1.5 items-baseline mt-3.5 font-sans text-[13px]">
              <span className="font-bold uppercase tracking-[.04em] text-[12px]">Date:</span>
              <span className="font-mono text-[13px]">June 14, 2025</span>
            </div>
          </div>

          {/* RIGHT — School info */}
          <div className="rc-panel">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2.5">
                <SchoolSeal/>
                <div style={{ fontFamily:"Georgia, serif", fontWeight:700, fontSize:26, lineHeight:1.05, letterSpacing:".01em" }}>Confidence School System</div>
                <SchoolSeal/>
              </div>
              <div className="text-[12px] mt-1.5 leading-[1.35] font-sans">
                Cooper Farm Fendell Community<br/>
                Montserrado County, Liberia<br/>
                +231-886-528-507 / 770-148-042
              </div>
              <div className="text-[12px] mt-1">
                Email: <span className="text-[#2a1a90] underline font-sans">confidenceschoolsystem@gmail.com</span>
              </div>
            </div>

            <div className="border-b-2 border-dotted border-[#2a1a1d] my-3"/>

            <div className="text-center font-bold text-[20px] tracking-[.06em] my-1.5">ACADEMIC 2024–2025</div>
            <div className="text-center font-bold text-[16px] tracking-[.04em] mt-1.5 font-sans uppercase">Student Report Card</div>
            <div className="text-center font-bold text-[15px] tracking-[.03em] font-sans uppercase">Kindergarten Division</div>

            <div className="flex gap-1.5 items-baseline mt-2.5 font-sans text-[13px]">
              <span className="font-bold uppercase tracking-[.04em] text-[12px]">Name:</span>
              <span className="flex-1 border-b border-[#2a1a1d] min-h-[18px] px-1 font-serif text-[14.5px] font-semibold">{s.name}</span>
            </div>
            <div className="flex gap-1.5 items-baseline mt-2.5 font-sans text-[13px]">
              <span className="font-bold uppercase tracking-[.04em] text-[12px]">Class:</span>
              <span className="flex-1 border-b border-[#2a1a1d] min-h-[18px] px-1 font-serif text-[14.5px] font-semibold">{s.class} · Kindergarten</span>
            </div>

            <div className="text-[12.5px] mt-2.5 font-semibold leading-[1.4]">
              Parent/guardian needs to sign each student card every period to indicate that he/she is aware of his/her child/ward&#39;s performance.
            </div>

            <table className="w-full border-collapse mt-2 font-sans" style={{ fontSize:12 }}>
              <thead>
                <tr>
                  <th className="border-[1.5px] border-[#2a1a1d] px-2 py-1 font-bold text-left bg-white/20">Period</th>
                  <th className="border-[1.5px] border-[#2a1a1d] px-2 py-1 font-bold text-left bg-white/20">Parent / Guard.</th>
                  <th className="border-[1.5px] border-[#2a1a1d] px-2 py-1 font-bold text-left bg-white/20">Sponsor</th>
                </tr>
              </thead>
              <tbody>
                {SIGS.map((row, i) => (
                  <tr key={i}>
                    <td className="border-[1.5px] border-[#2a1a1d] px-2 py-1 font-bold w-12">{row.pd}</td>
                    <td className="border-[1.5px] border-[#2a1a1d] px-2 py-1">
                      <span className={`rc-sig ${!row.parent ? "empty" : ""}`}>{row.parent || "·"}</span>
                    </td>
                    <td className="border-[1.5px] border-[#2a1a1d] px-2 py-1">
                      <span className={`rc-sig ${!row.sponsor ? "empty" : ""}`}>{row.sponsor || "·"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Back of card — marks table */}
      <div className="mt-6 rc-marks-page">
        <div className="rc-marks-paper">
          <table className="rc-marks-tbl">
            <thead>
              <tr>
                <th rowSpan={2} style={{ textAlign:"left", paddingLeft:8, width:"22%" }}>Subjects</th>
                <th colSpan={5} className="sem">First Semester</th>
                <th colSpan={5} className="sem">Second Semester</th>
                <th rowSpan={2} style={{ background:"rgba(80,18,28,.10)" }}>Yearly<br/>Ave.</th>
              </tr>
              <tr>
                <th>1<sup>st</sup> Pd</th><th>2<sup>nd</sup> Pd</th><th>3<sup>rd</sup> Pd</th>
                <th>Exam</th><th>Sem.<br/>Ave.</th>
                <th>4<sup>th</sup> Pd</th><th>5<sup>th</sup> Pd</th><th>6<sup>th</sup> Pd</th>
                <th>Exam</th><th>Sem.<br/>Ave.</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r.sub}>
                  <td className="subj">{r.sub}</td>
                  <td className="num">{fmt(r.p1)}</td><td className="num">{fmt(r.p2)}</td>
                  <td className="num">{fmt(r.p3)}</td><td className="num">{fmt(r.e1)}</td>
                  <td className="num avg">{r.sem1.toFixed(1)}</td>
                  <td className="num">{fmt(r.p4)}</td><td className="num">{fmt(r.p5)}</td>
                  <td className="num">{fmt(r.p6)}</td><td className="num">{fmt(r.e2)}</td>
                  <td className="num avg">{r.sem2.toFixed(1)}</td>
                  <td className="num yr-avg">{r.yr.toFixed(1)}</td>
                </tr>
              ))}
              <tr className="tot">
                <td className="subj">Average</td>
                <td colSpan={4}/>
                <td className="num avg">{sem1Avg.toFixed(1)}</td>
                <td colSpan={4}/>
                <td className="num avg">{sem2Avg.toFixed(1)}</td>
                <td className="num yr-avg">{c.yearly.toFixed(1)}</td>
              </tr>
              <tr>
                <td className="subj">Conduct</td>
                <td colSpan={4} style={{ textAlign:"center" }}>A — Excellent</td>
                <td className="num">—</td>
                <td colSpan={4} style={{ textAlign:"center" }}>A — Excellent</td>
                <td className="num">—</td>
                <td className="num">A</td>
              </tr>
              <tr>
                <td className="subj">Rank</td>
                <td colSpan={4} style={{ textAlign:"center" }}>#{rank} of {STUDENTS.length}</td>
                <td className="num">—</td>
                <td colSpan={4} style={{ textAlign:"center" }}>#{rank} of {STUDENTS.length}</td>
                <td className="num">—</td>
                <td className="num yr-avg">#{rank}</td>
              </tr>
            </tbody>
          </table>

          <div className="rc-marking mt-3.5 font-sans text-[11.5px] font-bold">
            <div className="uppercase tracking-[.05em] mb-1.5 text-[12px]">Marking Explanation</div>
            <div className="grid gap-y-1.5" style={{ gridTemplateColumns:"1fr 1fr", columnGap:24 }}>
              {GRADING_SCALE.map((g) => (
                <div key={g.range} className="flex gap-2 items-baseline whitespace-nowrap" style={{ gridColumn: g.range === "<70" ? "1 / -1" : undefined }}>
                  <b className="font-mono font-bold text-[#2a1a1d] w-[54px]">{g.range}</b>
                  <span className="font-serif font-bold text-[#2a1a1d] w-[22px]">{g.grade}</span>
                  <span>= {g.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SchoolSeal() {
  return (
    <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shrink-0">
      <Image src="/school-logo.png" alt="School seal" width={56} height={56} className="object-contain mix-blend-multiply"/>
    </div>
  );
}
