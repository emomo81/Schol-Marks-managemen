export type UserRole = "principal" | "vpa" | "teacher" | "sponsor";

export interface UserPerms {
  admin?: boolean;
  allClasses?: boolean;
  allSubjects?: boolean;
  canApprove?: boolean;
  canOverride?: boolean;
  canFinalize?: boolean;
  canManageUsers?: boolean;
  canManageSubjects?: boolean;
  viewAudit?: boolean;
  viewAnalytics?: boolean | "own";
  viewPromo?: "all" | "own";
  sponsor?: boolean;
  canSign?: boolean;
  canExportClass?: boolean;
  teacher?: boolean;
  canSubmit?: boolean;
}

export interface AppUser {
  id: string;
  name: string;
  initials: string;
  role: string;
  summary: string;
  perms: UserPerms;
  assignedClasses: string[];
  assignedSubjects: string[];
}

export interface StudentMarks {
  p1: number; p2: number; p3: number; e1: number;
  p4: number; p5: number; p6: number; e2: number;
}

export interface Student {
  id: string;
  name: string;
  admission: string;
  guardian: string;
  contact: string;
  class: string;
  marks: Record<string, StudentMarks>;
}

export interface ClassRecord {
  id: string;
  name: string;
  grade: string;
  sponsorId: string | null;
  students: number;
  room: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  assignedClasses: string[];
  assignedSubjects: string[];
  lastLogin: string;
}

export interface AuditEvent {
  t: string;
  who: string;
  action: string;
  target: string;
  reason?: string;
}

export interface SubjectRecord {
  id: number;
  name: string;
  active: boolean;
  order: number;
}

export interface GradingEntry {
  range: string;
  grade: string;
  label: string;
}

export interface ComputedRow {
  sub: string;
  p1: number; p2: number; p3: number; e1: number;
  p4: number; p5: number; p6: number; e2: number;
  sem1: number; sem2: number; yr: number;
}

export interface ComputedAverages {
  rows: ComputedRow[];
  yearly: number;
}
