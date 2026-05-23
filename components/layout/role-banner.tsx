import { Icon } from "@/components/ui/icon";
import type { AppUser } from "@/lib/types";

export function RoleBanner({ user }: { user: AppUser }) {
  return (
    <div className="flex items-center gap-2.5 px-7 py-2.5 bg-gradient-to-b from-[#2a201c] to-sidebar text-[#e8ddd2] text-[12.5px] border-b border-[#3b2a25]">
      <Icon name="shield" size={14} />
      <div>
        <b className="text-[#fdf5e6] font-semibold">{user.role}</b>
        <span className="text-[#6a5a50] mx-2">·</span>
        <span>{user.summary}</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10.5px] uppercase tracking-[.1em] text-[#a89889]">Classes</span>
        {user.perms.allClasses ? (
          <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-full text-[11px] font-medium bg-wine text-[#fdf5e6] border border-[#9a2a3d]">
            All ({user.assignedClasses.length})
          </span>
        ) : (
          user.assignedClasses.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 px-1.5 py-px rounded-full text-[11px] font-medium bg-[#3b2a25] text-[#e8ddd2] border border-[#4a3a32]">{c}</span>
          ))
        )}
        <span className="text-[10.5px] uppercase tracking-[.1em] text-[#a89889] ml-2">Subjects</span>
        {user.perms.allSubjects ? (
          <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-full text-[11px] font-medium bg-wine text-[#fdf5e6] border border-[#9a2a3d]">All</span>
        ) : (
          user.assignedSubjects.slice(0, 3).map((s) => (
            <span key={s} className="inline-flex items-center gap-1 px-1.5 py-px rounded-full text-[11px] font-medium bg-[#3b2a25] text-[#e8ddd2] border border-[#4a3a32]">{s}</span>
          ))
        )}
      </div>
    </div>
  );
}
