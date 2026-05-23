import type { ComputedAverages, StudentMarks, UserPerms } from "./types";

export function computeAverages(marks: Record<string, StudentMarks>): ComputedAverages {
  const subjects = Object.keys(marks);
  const rows = subjects.map((sub) => {
    const m = marks[sub];
    const sem1 = (m.p1 + m.p2 + m.p3 + m.e1) / 4;
    const sem2 = (m.p4 + m.p5 + m.p6 + m.e2) / 4;
    const yr = (sem1 + sem2) / 2;
    return { sub, ...m, sem1, sem2, yr };
  });
  const yearly = rows.reduce((a, r) => a + r.yr, 0) / rows.length;
  return { rows, yearly };
}

export function gradeFor(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "B+";
  if (score >= 80) return "B";
  if (score >= 75) return "C";
  if (score >= 70) return "C–";
  return "—";
}

export function fmt(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "—";
  return String(Math.round(n));
}

export function canAccess(perms: UserPerms, route: string): boolean {
  const map: Record<string, boolean> = {
    dash:      true,
    students:  true,
    entry:     !!(perms.teacher || perms.admin || perms.sponsor),
    reports:   true,
    promo:     !!perms.viewPromo,
    classes:   !!perms.admin,
    users:     !!perms.canManageUsers,
    subjects:  !!perms.canManageSubjects,
    analytics: !!perms.viewAnalytics,
    audit:     !!perms.viewAudit,
    settings:  !!perms.admin,
  };
  return map[route] ?? false;
}

function seedRand(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

export function makeMarks(seed: number, subjects: string[]): Record<string, StudentMarks> {
  const r = seedRand(seed);
  const out: Record<string, StudentMarks> = {};
  subjects.forEach((sub) => {
    out[sub] = {
      p1: 70 + Math.floor(r() * 28), p2: 70 + Math.floor(r() * 28),
      p3: 70 + Math.floor(r() * 28), e1: 70 + Math.floor(r() * 28),
      p4: 70 + Math.floor(r() * 28), p5: 70 + Math.floor(r() * 28),
      p6: 70 + Math.floor(r() * 28), e2: 70 + Math.floor(r() * 28),
    };
  });
  return out;
}
