"use client";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { canAccess } from "@/lib/utils";
import type { AppUser } from "@/lib/types";

const NAV_ITEMS = [
  { id: "dash",      label: "Dashboard",      icon: "dash"     as const, section: "main" },
  { id: "students",  label: "Students",       icon: "students" as const, section: "main" },
  { id: "entry",     label: "Mark Entry",     icon: "entry"    as const, section: "main" },
  { id: "reports",   label: "Report Cards",   icon: "report"   as const, section: "main" },
  { id: "promo",     label: "Promotional",    icon: "prom"     as const, section: "main" },
  { id: "classes",   label: "Classes",        icon: "home"     as const, section: "admin" },
  { id: "users",     label: "Users & Access", icon: "shield"   as const, section: "admin" },
  { id: "subjects",  label: "Subjects",       icon: "subjects" as const, section: "admin" },
  { id: "analytics", label: "Analytics",      icon: "chart"    as const, section: "admin" },
  { id: "audit",     label: "Audit Log",      icon: "audit"    as const, section: "admin" },
  { id: "settings",  label: "Settings",       icon: "settings" as const, section: "admin" },
];

interface SidebarProps {
  route: string;
  setRoute: (route: string) => void;
  user: AppUser;
}

export function Sidebar({ route, setRoute, user }: SidebarProps) {
  const visible = NAV_ITEMS.filter((it) => canAccess(user.perms, it.id));
  const mainItems = visible.filter((it) => it.section === "main");
  const adminItems = visible.filter((it) => it.section === "admin");

  const entryLabel = user.perms.sponsor && !user.perms.teacher ? "Class Marks" : "Mark Entry";
  const studentBadge = user.perms.allClasses ? "248" : String(16);

  return (
    <aside className="bg-sidebar text-[#e8ddd2] border-r border-[#2a201c] flex flex-col sticky top-0 h-screen">
      {/* Brand */}
      <div className="px-[22px] py-[22px] pb-4 border-b border-[#2a201c]">
        <div className="flex items-center gap-2.5">
          <div className="w-[38px] h-[38px] rounded-full bg-[#fdf5e6] border border-[#c9a85a] flex items-center justify-center overflow-hidden shrink-0">
            <Image src="/school-logo.png" alt="Confidence School System" width={38} height={38} className="object-cover" />
          </div>
          <div>
            <h1 className="font-serif font-semibold text-[18px] m-0 tracking-[.01em]">Confidence</h1>
            <div className="text-[11px] text-[#a89889] mt-0.5 tracking-[.04em] uppercase">School System</div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="text-[10.5px] tracking-[.12em] uppercase text-[#a89889] px-3.5 pt-[18px] pb-1.5">Academic</div>
      <nav className="flex flex-col gap-px px-2">
        {mainItems.map((it) => (
          <button
            key={it.id}
            onClick={() => setRoute(it.id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] cursor-pointer transition-colors w-full text-left
              ${route === it.id ? "bg-[#3b2a25] text-[#fdf5e6]" : "text-[#cdbfb2] hover:bg-[#2a201c] hover:text-[#f1e7da]"}`}
          >
            <Icon name={it.icon} size={16} />
            <span>{it.id === "entry" ? entryLabel : it.label}</span>
            {it.id === "students" && (
              <span className={`ml-auto font-mono text-[10.5px] px-1.5 py-px rounded-full
                ${route === it.id ? "bg-wine text-[#f7e9ec]" : "bg-[#3b2a25] text-[#d9c9b6]"}`}>
                {studentBadge}
              </span>
            )}
            {it.id === "entry" && user.perms.teacher && !user.perms.admin && (
              <span className={`ml-auto font-mono text-[10.5px] px-1.5 py-px rounded-full
                ${route === it.id ? "bg-wine text-[#f7e9ec]" : "bg-[#3b2a25] text-[#d9c9b6]"}`}>
                {user.assignedSubjects.length}×{user.assignedClasses.length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Admin nav */}
      {adminItems.length > 0 && (
        <>
          <div className="text-[10.5px] tracking-[.12em] uppercase text-[#a89889] px-3.5 pt-[18px] pb-1.5">Administration</div>
          <nav className="flex flex-col gap-px px-2">
            {adminItems.map((it) => (
              <button
                key={it.id}
                onClick={() => setRoute(it.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13.5px] cursor-pointer transition-colors w-full text-left
                  ${route === it.id ? "bg-[#3b2a25] text-[#fdf5e6]" : "text-[#cdbfb2] hover:bg-[#2a201c] hover:text-[#f1e7da]"}`}
              >
                <Icon name={it.icon} size={16} />
                <span>{it.label}</span>
              </button>
            ))}
          </nav>
        </>
      )}

      {/* Footer */}
      <div className="mt-auto px-3.5 py-3.5 border-t border-[#2a201c] flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-wine text-[#f7e9ec] flex items-center justify-center font-semibold text-[12px]">
          {user.initials}
        </div>
        <div className="text-[12.5px] leading-tight">
          <div className="text-[#f1e7da]">{user.name}</div>
          <div className="text-[#a89889] text-[11px]">{user.role}</div>
        </div>
      </div>
    </aside>
  );
}
