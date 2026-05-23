"use client";
import { useState } from "react";
import { PageHead } from "@/components/page-head";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { SUBJECTS_K } from "@/lib/data";
import type { SubjectRecord } from "@/lib/types";

const TEACHERS = ["Mr. Cooper","Ms. Wleh","Mr. Bility","Mrs. Kollie"];

export function SubjectsScreen() {
  const [list, setList] = useState<SubjectRecord[]>(SUBJECTS_K.map((s, i) => ({ id:i, name:s, active:true, order:i+1 })));
  const [grade, setGrade] = useState("Kindergarten");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  function addSubject() {
    if (!newName.trim()) return;
    setList((p) => [...p, { id: p.length, name: newName.trim(), active:true, order: p.length+1 }]);
    setNewName(""); setAdding(false);
  }

  return (
    <div className="p-7 pb-16 max-w-[1400px]">
      <PageHead
        title="Subjects"
        sub="Subject lists are scoped per grade · changes preserve historical mark records"
        actions={<button onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2"><Icon name="plus" size={14}/> Add subject</button>}
      />

      <div className="bg-paper-2 border border-rule rounded-lg mb-3.5">
        <div className="px-4 py-3 flex gap-3 items-center">
          <span className="text-ink-3 text-[12px]">Grade:</span>
          <div className="flex border border-rule rounded-md overflow-hidden">
            {["Kindergarten","Grade 1","Grade 2","Grade 3","Grade 5","Grade 7","Grade 10"].map((g) => (
              <button key={g} onClick={() => setGrade(g)} className={`px-3 py-1.5 text-[12.5px] ${grade===g ? "bg-ink text-[#f7f2ec]" : "bg-transparent text-ink-2"}`}>{g}</button>
            ))}
          </div>
          <div className="flex-1"/>
          <Chip>{list.length} subjects</Chip>
        </div>
      </div>

      <div className="bg-paper-2 border border-rule rounded-lg">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{["Order","Subject name","Status","Teachers assigned","Mark records",""].map((h) => (
              <th key={h} className="px-3.5 py-2.5 text-left font-medium text-ink-3 text-[11.5px] uppercase tracking-[.08em] bg-paper-2 border-b border-rule-2">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="hover:bg-paper-2 border-b border-rule-2">
                <td className="px-3.5 py-2.5 font-mono text-ink-3">{String(s.order).padStart(2,"0")}</td>
                <td className="px-3.5 py-2.5 font-serif font-medium text-[15px]">{s.name}</td>
                <td className="px-3.5 py-2.5">{s.active ? <Chip kind="ok" dot>Active</Chip> : <Chip>Inactive</Chip>}</td>
                <td className="px-3.5 py-2.5">{TEACHERS[s.id % 4]}</td>
                <td className="px-3.5 py-2.5 font-mono text-ink-3">{12 * 8}</td>
                <td className="px-3.5 py-2.5">
                  <div className="flex gap-1">
                    <button className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] rounded-md border border-rule bg-paper-2 hover:bg-paper-3"><Icon name="edit" size={12}/> Rename</button>
                    <button onClick={() => setList((p) => p.map((x) => x.id===s.id ? {...x, active:!x.active} : x))} className="px-2.5 py-1 text-[12px] rounded-md border border-transparent text-ink-2 hover:bg-paper-3">{s.active ? "Deactivate" : "Activate"}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {adding && (
        <div className="fixed inset-0 bg-black/45 z-50 grid place-items-center" onClick={() => setAdding(false)}>
          <div className="bg-paper-2 border border-rule rounded-lg w-[420px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-[22px] py-[18px] pb-1.5 flex justify-between items-center">
              <h3 className="font-serif text-[22px] font-semibold m-0">Add subject</h3>
              <button onClick={() => setAdding(false)} className="text-ink-2 hover:text-ink px-2 py-1">✕</button>
            </div>
            <div className="px-[22px] py-1.5 pb-3.5">
              <label className="block text-[12px] text-ink-2 mb-1 font-medium">Subject name</label>
              <input autoFocus className="w-full px-3 py-2.5 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key==="Enter" && addSubject()} placeholder="e.g. Civics"/>
              <div className="text-[11.5px] text-ink-3 mt-1.5">Will be added as the last subject for <b>{grade}</b>.</div>
            </div>
            <div className="px-[22px] py-3.5 border-t border-rule flex gap-2 justify-end">
              <button onClick={() => setAdding(false)} className="px-3 py-[7px] rounded-md border border-transparent text-ink-2 hover:bg-paper-3 text-[13px]">Cancel</button>
              <button disabled={!newName.trim()} onClick={addSubject} className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2 disabled:opacity-50">
                <Icon name="plus" size={14}/> Add subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
