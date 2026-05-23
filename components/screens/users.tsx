"use client";
import { useState } from "react";
import { PageHead } from "@/components/page-head";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { CLASSES, SUBJECTS_K, USERS, ROLE_LABEL } from "@/lib/data";
import type { UserRecord, UserRole } from "@/lib/types";

const ROLE_COLOR: Record<string, string> = {
  principal:"#7a1d2e", vpa:"#2a4a7a", teacher:"#5a3a1c", sponsor:"#2f6b46",
};
const ROLE_BG: Record<string, string> = {
  principal:"var(--tw-bg-opacity)", vpa:"#d8e2f1", teacher:"#efe2d2", sponsor:"#dee9e1",
};

export function UsersScreen() {
  const [list, setList] = useState<UserRecord[]>(USERS);
  const [edit, setEdit] = useState<UserRecord | "new" | null>(null);
  const [filterRole, setFilterRole] = useState("all");
  const filtered = list.filter((u) => filterRole === "all" || u.role === filterRole);

  function save(u: UserRecord) {
    if (list.find((x) => x.id === u.id)) setList((p) => p.map((x) => x.id === u.id ? u : x));
    else {
      const id = "U-" + u.name.split(" ").map((p) => p[0]).join("").toUpperCase() + Math.floor(Math.random()*99);
      setList((p) => [...p, { ...u, id, status:"active", lastLogin:"Never" }]);
    }
    setEdit(null);
  }

  return (
    <div className="p-7 pb-16 max-w-[1400px]">
      <PageHead
        title="Users & Access"
        sub="Create login credentials · assign role · scope to classes and subjects · deactivate without deleting"
        actions={<>
          <button className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-rule bg-paper-2 text-ink text-[13px] hover:bg-paper-3"><Icon name="download" size={14}/> Export CSV</button>
          <button onClick={() => setEdit("new")} className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2"><Icon name="plus" size={14}/> New user</button>
        </>}
      />

      <div className="bg-paper-2 border border-rule rounded-lg mb-3.5">
        <div className="px-4 py-3 flex gap-2.5 items-center">
          <span className="text-ink-3 text-[12px]">Role:</span>
          <div className="flex border border-rule rounded-md overflow-hidden">
            {[["all","All"],["principal","Principals"],["vpa","VPAs"],["teacher","Teachers"],["sponsor","Sponsors"]].map(([k,l]) => (
              <button key={k} onClick={() => setFilterRole(k)} className={`px-3 py-[5px] text-[12.5px] border-none ${filterRole===k ? "bg-ink text-[#f7f2ec]" : "bg-transparent text-ink-2"}`}>{l}</button>
            ))}
          </div>
          <div className="flex-1"/>
          <Chip>{filtered.length} users · {filtered.filter((u) => u.status==="active").length} active</Chip>
        </div>
      </div>

      <div className="bg-paper-2 border border-rule rounded-lg">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>{["User","Role","Classes","Subjects","Last login","Status",""].map((h) => (
              <th key={h} className="px-3.5 py-2.5 text-left font-medium text-ink-3 text-[11.5px] uppercase tracking-[.08em] bg-paper-2 border-b border-rule-2">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-paper-2 border-b border-rule-2">
                <td className="px-3.5 py-2.5">
                  <div className="flex gap-2.5 items-center">
                    <div className="w-8 h-8 rounded-full grid place-items-center font-semibold text-[11.5px] text-white" style={{ background: ROLE_COLOR[u.role] ?? "#4a3f3a" }}>
                      {u.name.split(" ").map((p) => p[0]).slice(0,2).join("")}
                    </div>
                    <div><div className="font-medium">{u.name}</div><div className="text-[11.5px] text-ink-3 font-mono">{u.email}</div></div>
                  </div>
                </td>
                <td className="px-3.5 py-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11.5px] font-semibold border" style={{ color: ROLE_COLOR[u.role], borderColor: "currentColor", background: u.role==="principal" ? "#f3e0e3" : ROLE_BG[u.role] }}>
                    {ROLE_LABEL[u.role] ?? u.role}
                  </span>
                </td>
                <td className="px-3.5 py-2.5">
                  {u.role==="principal"||u.role==="vpa" ? <span className="text-ink-3 text-[12px]">All</span>
                    : u.assignedClasses.length===0 ? <Chip kind="warn">None</Chip>
                    : <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {u.assignedClasses.slice(0,3).map((c) => <Chip key={c}>{c}</Chip>)}
                        {u.assignedClasses.length>3 && <span className="text-[11px] text-ink-3 self-center">+{u.assignedClasses.length-3}</span>}
                      </div>}
                </td>
                <td className="px-3.5 py-2.5">
                  {u.role==="teacher"
                    ? (u.assignedSubjects.length===0 ? <Chip kind="warn">None</Chip>
                      : <div className="flex gap-1 flex-wrap max-w-[240px]">
                          {u.assignedSubjects.slice(0,3).map((s) => <Chip key={s}>{s}</Chip>)}
                          {u.assignedSubjects.length>3 && <span className="text-[11px] text-ink-3 self-center">+{u.assignedSubjects.length-3}</span>}
                        </div>)
                    : <span className="text-ink-3 text-[12px]">—</span>}
                </td>
                <td className="px-3.5 py-2.5 font-mono text-[11.5px] text-ink-2">{u.lastLogin}</td>
                <td className="px-3.5 py-2.5">{u.status==="active" ? <Chip kind="ok" dot>Active</Chip> : <Chip kind="err" dot>Deactivated</Chip>}</td>
                <td className="px-3.5 py-2.5">
                  <div className="flex gap-1">
                    <button onClick={() => setEdit(u)} className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] rounded-md border border-rule bg-paper-2 hover:bg-paper-3"><Icon name="edit" size={12}/> Edit</button>
                    <button className="px-2.5 py-1 text-[12px] rounded-md border border-transparent text-ink-2 hover:bg-paper-3">Reset pw</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && <UserEditor u={edit==="new" ? null : edit} onClose={() => setEdit(null)} onSave={save}/>}
    </div>
  );
}

function UserEditor({ u, onClose, onSave }: {
  u: UserRecord | null;
  onClose: () => void;
  onSave: (u: UserRecord) => void;
}) {
  const [form, setForm] = useState<UserRecord>(u ?? { id:"", name:"", email:"", role:"teacher", status:"active", assignedClasses:[], assignedSubjects:[], lastLogin:"" });
  const set = <K extends keyof UserRecord>(k: K, v: UserRecord[K]) => setForm({ ...form, [k]: v });
  const toggleClass = (c: string) => set("assignedClasses", form.assignedClasses.includes(c) ? form.assignedClasses.filter((x) => x!==c) : [...form.assignedClasses, c]);
  const toggleSubject = (s: string) => set("assignedSubjects", form.assignedSubjects.includes(s) ? form.assignedSubjects.filter((x) => x!==s) : [...form.assignedSubjects, s]);
  const needsClasses = form.role==="teacher"||form.role==="sponsor";
  const needsSubjects = form.role==="teacher";
  const [pwd, setPwd] = useState("");

  return (
    <div className="fixed inset-0 bg-black/45 z-50 grid place-items-center" onClick={onClose}>
      <div className="bg-paper-2 border border-rule rounded-lg w-[640px] max-w-[90vw] max-h-[90vh] overflow-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="px-[22px] py-[18px] pb-1.5 flex justify-between items-center sticky top-0 bg-paper-2 border-b border-rule">
          <h3 className="font-serif text-[22px] font-semibold m-0">{u ? `Edit ${u.name}` : "Create new user"}</h3>
          <button onClick={onClose} className="text-ink-2 hover:text-ink px-2 py-1">✕</button>
        </div>
        <div className="px-[22px] py-3 pb-3.5">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className="block text-[12px] text-ink-2 mb-1 font-medium">Full name</label><input className="w-full px-3 py-2.5 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Mary Kollie"/></div>
            <div><label className="block text-[12px] text-ink-2 mb-1 font-medium">Email (login)</label><input className="w-full px-3 py-2.5 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="m.kollie@confidenceschool.lr"/></div>
          </div>
          {!u && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div><label className="block text-[12px] text-ink-2 mb-1 font-medium">Temporary password</label>
                <div className="flex gap-1.5">
                  <input className="flex-1 px-3 py-2.5 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Auto-generated"/>
                  <button onClick={() => setPwd(Math.random().toString(36).slice(2,10)+"!")} className="px-2.5 py-1 text-[12px] rounded-md border border-rule bg-paper-2 hover:bg-paper-3">Generate</button>
                </div>
                <div className="text-[11.5px] text-ink-3 mt-1.5">User will be required to change on first login.</div>
              </div>
              <div><label className="block text-[12px] text-ink-2 mb-1 font-medium">Initial status</label>
                <select className="w-full px-3 py-2.5 border border-rule rounded-md bg-paper text-[13.5px] outline-none focus:border-wine" value={form.status} onChange={(e) => set("status", e.target.value as "active"|"inactive")}>
                  <option value="active">Active — can log in immediately</option>
                  <option value="inactive">Inactive — created but blocked</option>
                </select>
              </div>
            </div>
          )}
          <div className="mb-3"><label className="block text-[12px] text-ink-2 mb-1 font-medium">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(["principal","vpa","teacher","sponsor"] as UserRole[]).map((r) => (
                <div key={r} onClick={() => set("role", r)} className={`role-pick ${form.role===r ? "on" : ""}`}>
                  <div className="font-semibold text-[13px]">{ROLE_LABEL[r]}</div>
                  <div className="text-[11.5px] text-ink-3 mt-0.5">{r==="principal" ? "Full system access" : r==="vpa" ? "Approve marks, manage subjects" : r==="teacher" ? "Enter marks for assigned class × subject" : "Sign off and export for one class"}</div>
                </div>
              ))}
            </div>
          </div>
          {needsClasses && (
            <div className="mb-3"><label className="block text-[12px] text-ink-2 mb-1 font-medium">Assigned classes {form.role==="sponsor" && <span className="text-ink-3 font-normal">· sponsor: pick one</span>}</label>
              <div className="flex gap-1.5 flex-wrap p-2 border border-rule rounded-md bg-paper">
                {CLASSES.map((c) => (
                  <span key={c.id} onClick={() => toggleClass(c.name)} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-medium border cursor-pointer select-none ${form.assignedClasses.includes(c.name) ? "bg-wine-soft text-wine border-[#e8c5cc]" : "bg-paper-3 text-ink-2 border-rule"}`}>{c.name}</span>
                ))}
              </div>
            </div>
          )}
          {needsSubjects && (
            <div className="mb-3"><label className="block text-[12px] text-ink-2 mb-1 font-medium">Assigned subjects</label>
              <div className="flex gap-1.5 flex-wrap p-2 border border-rule rounded-md bg-paper">
                {SUBJECTS_K.map((s) => (
                  <span key={s} onClick={() => toggleSubject(s)} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-medium border cursor-pointer select-none ${form.assignedSubjects.includes(s) ? "bg-wine-soft text-wine border-[#e8c5cc]" : "bg-paper-3 text-ink-2 border-rule"}`}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {(form.role==="principal"||form.role==="vpa") && (
            <div className="px-3 py-2.5 bg-wine-soft border border-[#e8c5cc] rounded-md text-[12.5px] text-wine">
              <b>Full access:</b> {form.role==="principal" ? "Can finalize promotions, override marks, manage all users, classes, and subjects." : "Can approve submissions, override marks, manage subjects, view audit and analytics."}
            </div>
          )}
        </div>
        <div className="px-[22px] py-3.5 border-t border-rule flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-[7px] rounded-md border border-transparent text-ink-2 hover:bg-paper-3 text-[13px]">Cancel</button>
          <button onClick={() => onSave(form)}
            disabled={!form.name.trim() || !form.email.trim() || (needsClasses && form.assignedClasses.length===0) || (needsSubjects && form.assignedSubjects.length===0)}
            className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-md border border-wine bg-wine text-[#fdf5e6] text-[13px] hover:bg-wine-2 disabled:opacity-50">
            <Icon name="check" size={14}/> {u ? "Save changes" : "Create account & send invite"}
          </button>
        </div>
      </div>
    </div>
  );
}
