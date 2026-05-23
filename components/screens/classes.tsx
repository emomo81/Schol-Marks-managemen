"use client";
import { useState } from "react";
import { PageHead } from "@/components/page-head";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { CLASSES, USERS } from "@/lib/data";
import type { ClassRecord } from "@/lib/types";

const GRADE_OPTIONS = [
  "Kindergarten","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6",
  "Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12",
];

export function ClassesScreen() {
  const [list, setList] = useState<ClassRecord[]>(CLASSES);
  const [edit, setEdit] = useState<ClassRecord | "new" | null>(null);
  const sponsors = USERS.filter((u) => u.role === "sponsor");
  const sponsorById = (id: string | null) => USERS.find((u) => u.id === id) ?? null;

  function save(cls: ClassRecord) {
    if (list.find((c) => c.id === cls.id)) setList((p) => p.map((c) => c.id === cls.id ? cls : c));
    else setList((p) => [...p, { ...cls, id: "C-" + cls.name.replace(/\s+/g,"-").toUpperCase(), students:0 }]);
    setEdit(null);
  }

  return (
    <div className="p-7 pb-16 max-w-[1400px]">
      <PageHead
        title="Classes"
        sub="Kindergarten through Grade 12 · 16 classes · assign a sponsor to each"
        actions={<>
          <button className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-rule bg-paper-2 text-ink text-[13px] hover:bg-paper-3"><Icon name="download" size={14}/> Export CSV</button>
          <button onClick={() => setEdit("new")} className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2"><Icon name="plus" size={14}/> New class</button>
        </>}
      />

      <div className="bg-paper-2 border border-rule rounded-lg">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{["Class","Grade level","Room","Students","Class Sponsor","Status",""].map((h) => (
              <th key={h} className="px-3.5 py-2.5 text-left font-medium text-ink-3 text-[11.5px] uppercase tracking-[.08em] bg-paper-2 border-b border-rule-2">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {list.map((c) => {
              const sp = sponsorById(c.sponsorId);
              return (
                <tr key={c.id} className="hover:bg-paper-2 border-b border-rule-2">
                  <td className="px-3.5 py-2.5">
                    <div className="font-serif font-semibold text-[16px]">{c.name}</div>
                    <div className="font-mono text-[11px] text-ink-3">{c.id}</div>
                  </td>
                  <td className="px-3.5 py-2.5">{c.grade}</td>
                  <td className="px-3.5 py-2.5 font-mono">{c.room}</td>
                  <td className="px-3.5 py-2.5 font-mono">{c.students}</td>
                  <td className="px-3.5 py-2.5">
                    {sp ? (
                      <div className="flex gap-2 items-center">
                        <div className="w-6 h-6 rounded-full bg-wine-soft text-wine grid place-items-center font-semibold text-[10px]">
                          {sp.name.split(" ").map((p) => p[0]).slice(0,2).join("")}
                        </div>
                        <div>
                          <div className="font-medium text-[13px]">{sp.name}</div>
                          <div className="text-[11px] text-ink-3">{sp.email}</div>
                        </div>
                      </div>
                    ) : <Chip kind="warn" dot>No sponsor assigned</Chip>}
                  </td>
                  <td className="px-3.5 py-2.5"><Chip kind="ok" dot>Active</Chip></td>
                  <td className="px-3.5 py-2.5">
                    <div className="flex gap-1">
                      <button onClick={() => setEdit(c)} className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] rounded-md border border-rule bg-paper-2 hover:bg-paper-3"><Icon name="edit" size={12}/> Edit</button>
                      <button onClick={() => setList((p) => p.filter((x) => x.id !== c.id))} className="px-2.5 py-1 text-[12px] rounded-md border border-transparent text-err hover:bg-paper-3">Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {edit && (
        <ClassEditor klass={edit === "new" ? null : edit} sponsors={sponsors} onClose={() => setEdit(null)} onSave={save}/>
      )}
    </div>
  );
}

function ClassEditor({ klass, sponsors, onClose, onSave }: {
  klass: ClassRecord | null;
  sponsors: typeof USERS;
  onClose: () => void;
  onSave: (cls: ClassRecord) => void;
}) {
  const [form, setForm] = useState<ClassRecord>(klass ?? { id:"", name:"", grade:"Grade 1", room:"", sponsorId:null, students:0 });
  const set = <K extends keyof ClassRecord>(k: K, v: ClassRecord[K]) => setForm({ ...form, [k]: v });

  return (
    <div className="fixed inset-0 bg-black/45 z-50 grid place-items-center" onClick={onClose}>
      <div className="bg-paper-2 border border-rule rounded-lg w-[540px] max-w-[90vw] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="px-[22px] py-[18px] pb-1.5 flex justify-between items-center">
          <h3 className="font-serif text-[22px] font-semibold m-0">{klass ? `Edit ${klass.name}` : "New class"}</h3>
          <button onClick={onClose} className="text-ink-2 hover:text-ink px-2 py-1">✕</button>
        </div>
        <div className="px-[22px] py-1.5 pb-3.5">
          <div className="mb-3"><label className="block text-[12px] text-ink-2 mb-1 font-medium">Class name</label>
            <input className="w-full px-3 py-2.5 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Grade 5-A"/>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className="block text-[12px] text-ink-2 mb-1 font-medium">Grade level</label>
              <select className="w-full px-3 py-2.5 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine" value={form.grade} onChange={(e) => set("grade", e.target.value)}>
                {GRADE_OPTIONS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div><label className="block text-[12px] text-ink-2 mb-1 font-medium">Room</label>
              <input className="w-full px-3 py-2.5 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine" value={form.room} onChange={(e) => set("room", e.target.value)} placeholder="e.g. P-6"/>
            </div>
          </div>
          <div className="mb-3"><label className="block text-[12px] text-ink-2 mb-1 font-medium">Class Sponsor</label>
            <select className="w-full px-3 py-2.5 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine" value={form.sponsorId ?? ""} onChange={(e) => set("sponsorId", e.target.value || null)}>
              <option value="">— No sponsor assigned —</option>
              {sponsors.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
            </select>
            <div className="text-[11.5px] text-ink-3 mt-1.5">Sponsor owns full marks for this class and signs off on each period.</div>
          </div>
        </div>
        <div className="px-[22px] py-3.5 border-t border-rule flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-[7px] rounded-md border border-transparent text-ink-2 hover:bg-paper-3 text-[13px]">Cancel</button>
          <button disabled={!form.name.trim()} onClick={() => onSave(form)} className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2 disabled:opacity-50">
            <Icon name="check" size={14}/> {klass ? "Save changes" : "Create class"}
          </button>
        </div>
      </div>
    </div>
  );
}
