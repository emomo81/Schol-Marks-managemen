"use client";
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { RoleBanner } from "@/components/layout/role-banner";
import { ROLES_DATA } from "@/lib/data";
import type { AppUser } from "@/lib/types";

// Screen components
import { DashboardScreen } from "@/components/screens/dashboard";
import { StudentsScreen } from "@/components/screens/students";
import { MarkEntryScreen } from "@/components/screens/mark-entry";
import { ReportCardScreen } from "@/components/screens/report-card";
import { PromotionalScreen } from "@/components/screens/promotional";
import { ClassesScreen } from "@/components/screens/classes";
import { UsersScreen } from "@/components/screens/users";
import { SubjectsScreen } from "@/components/screens/subjects";
import { AnalyticsScreen } from "@/components/screens/analytics";
import { AuditLogScreen } from "@/components/screens/audit-log";
import { SettingsScreen } from "@/components/screens/settings";

const ROUTE_LABELS: Record<string, string> = {
  dash: "Dashboard", students: "Students", entry: "Mark Entry",
  reports: "Report Cards", promo: "Promotional", classes: "Classes",
  users: "Users & Access", subjects: "Subjects", analytics: "Analytics",
  audit: "Audit Log", settings: "Settings",
};

export function AppShell({ initialRole }: { initialRole?: string }) {
  const [role, setRole] = useState<string>(initialRole ?? "principal");
  const [route, setRoute] = useState("dash");
  const user: AppUser = ROLES_DATA[role] ?? ROLES_DATA.principal;

  function renderScreen() {
    switch (route) {
      case "dash":     return <DashboardScreen user={user} goto={setRoute} />;
      case "students": return <StudentsScreen  user={user} goto={setRoute} />;
      case "entry":    return <MarkEntryScreen  user={user} />;
      case "reports":  return <ReportCardScreen />;
      case "promo":    return <PromotionalScreen user={user} />;
      case "classes":  return <ClassesScreen />;
      case "users":    return <UsersScreen />;
      case "subjects": return <SubjectsScreen />;
      case "analytics":return <AnalyticsScreen />;
      case "audit":    return <AuditLogScreen />;
      case "settings": return <SettingsScreen />;
      default:         return <DashboardScreen user={user} goto={setRoute} />;
    }
  }

  return (
    <div className="grid min-h-screen" style={{ gridTemplateColumns: "248px 1fr" }}>
      <Sidebar route={route} setRoute={setRoute} user={user} />

      <div className="flex flex-col min-w-0">
        {/* Demo role switcher */}
        <div className="flex items-center gap-3 px-7 py-2 bg-[#2a201c] text-[#a89889] text-[12px] border-b border-[#3b2a25]">
          <span className="uppercase tracking-[.1em] text-[10.5px]">Demo role:</span>
          {(["principal","vpa","teacher","sponsor"] as const).map((r) => (
            <button
              key={r}
              onClick={() => { setRole(r); setRoute("dash"); }}
              className={`px-2.5 py-0.5 rounded text-[11.5px] font-medium transition-colors ${
                role === r ? "bg-wine text-[#fdf5e6]" : "text-[#cdbfb2] hover:text-[#f1e7da]"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <RoleBanner user={user} />
        <Topbar crumbs={["Confidence School System", ROUTE_LABELS[route] ?? route]} />

        <main className="flex-1 overflow-auto">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}
