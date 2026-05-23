"use client";
import { PageHead } from "@/components/page-head";
import { Chip } from "@/components/ui/chip";
import { GRADING_SCALE, PERIODS } from "@/lib/data";

export function SettingsScreen() {
  return (
    <div className="p-7 pb-16 max-w-[1400px]">
      <PageHead title="Settings" sub="Academic year, grading scale, user accounts, school details"/>
      <div className="grid gap-[18px]" style={{ gridTemplateColumns:"2fr 1fr" }}>
        <div className="bg-paper-2 border border-rule rounded-lg">
          <div className="px-[18px] py-3.5 border-b border-rule"><h3 className="m-0 font-serif font-semibold text-[18px]">Academic year</h3></div>
          <div className="p-[18px]">
            <div className="mb-3"><label className="block text-[12px] text-ink-2 mb-1 font-medium">Current year</label>
              <input defaultValue="2024–2025" className="w-full px-3 py-2.5 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine"/>
            </div>
            <div className="mb-3"><label className="block text-[12px] text-ink-2 mb-1 font-medium">Mark entry window</label>
              <input defaultValue="Open · 3rd Period" className="w-full px-3 py-2.5 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine"/>
            </div>
            <div><label className="block text-[12px] text-ink-2 mb-1 font-medium">Active periods</label>
              <div className="flex gap-1.5 flex-wrap">
                {PERIODS.map((p, i) => <Chip key={i} kind={i<3?"ok":""} dot={i<3}>{p}</Chip>)}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-paper-2 border border-rule rounded-lg">
          <div className="px-[18px] py-3.5 border-b border-rule"><h3 className="m-0 font-serif font-semibold text-[18px]">Grading scale</h3></div>
          <table className="w-full border-collapse text-[13px]">
            <thead><tr>{["Range","Grade","Label"].map((h) => (
              <th key={h} className="px-3.5 py-2.5 text-left font-medium text-ink-3 text-[11.5px] uppercase tracking-[.08em] bg-paper-2 border-b border-rule-2">{h}</th>
            ))}</tr></thead>
            <tbody>
              {GRADING_SCALE.map((g) => (
                <tr key={g.range} className="hover:bg-paper-2 border-b border-rule-2">
                  <td className="px-3.5 py-2.5 font-mono">{g.range}</td>
                  <td className="px-3.5 py-2.5 font-serif font-semibold">{g.grade}</td>
                  <td className="px-3.5 py-2.5">{g.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
