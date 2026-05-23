import type { AppUser, AuditEvent, ClassRecord, GradingEntry, UserRecord } from "./types";
import { makeMarks } from "./utils";

export const SUBJECTS_K = [
  "Mathematics","English","Phonics","Science","Reading","S. Studies",
  "Bible","Spelling","Rhymes","Writing","Hygiene","Arts",
  "Shapes & Colors","Alphabet","P.E.",
];

export const GRADING_SCALE: GradingEntry[] = [
  { range: "95–100", grade: "A+", label: "Excellent" },
  { range: "90–94",  grade: "A",  label: "Satisfactory" },
  { range: "85–89",  grade: "B+", label: "Very Good" },
  { range: "80–84",  grade: "B",  label: "Good" },
  { range: "75–79",  grade: "C",  label: "Credit" },
  { range: "70–74",  grade: "C–", label: "Needs Improvement" },
  { range: "<70",    grade: "—",  label: "Not at This Time" },
];

export const PERIODS = ["1st Pd","2nd Pd","3rd Pd","Exam","4th Pd","5th Pd","6th Pd","Exam"];

export const STUDENTS = [
  { id:"S-2024-001", name:"Aminata Konneh",   admission:"KG-1407", guardian:"Fatu Konneh",      contact:"+231 770 148 042", class:"KG-A",      marks: makeMarks(11, SUBJECTS_K) },
  { id:"S-2024-002", name:"Emmanuel Kollie",  admission:"KG-1408", guardian:"Mary Kollie",      contact:"+231 886 528 507", class:"KG-A",      marks: makeMarks(22, SUBJECTS_K) },
  { id:"S-2024-003", name:"Princess Tarpeh",  admission:"KG-1409", guardian:"James Tarpeh",     contact:"+231 770 901 233", class:"KG-A",      marks: makeMarks(33, SUBJECTS_K) },
  { id:"S-2024-004", name:"Joseph Gbeh",      admission:"KG-1410", guardian:"Sarah Gbeh",       contact:"+231 886 112 909", class:"KG-A",      marks: makeMarks(44, SUBJECTS_K) },
  { id:"S-2024-005", name:"Faith Nyenkan",    admission:"KG-1411", guardian:"Patience Nyenkan", contact:"+231 770 552 102", class:"KG-A",      marks: makeMarks(55, SUBJECTS_K) },
  { id:"S-2024-006", name:"Daniel Sayeh",     admission:"KG-1412", guardian:"Moses Sayeh",      contact:"+231 886 770 014", class:"KG-A",      marks: makeMarks(66, SUBJECTS_K) },
  { id:"S-2024-007", name:"Blessing Quoi",    admission:"KG-1413", guardian:"Hawa Quoi",        contact:"+231 770 224 880", class:"KG-A",      marks: makeMarks(77, SUBJECTS_K) },
  { id:"S-2024-008", name:"Samuel Mulbah",    admission:"KG-1414", guardian:"Ruth Mulbah",      contact:"+231 886 305 718", class:"KG-A",      marks: makeMarks(88, SUBJECTS_K) },
  { id:"S-2024-009", name:"Grace Wesseh",     admission:"KG-1415", guardian:"Comfort Wesseh",   contact:"+231 770 661 050", class:"KG-A",      marks: makeMarks(99, SUBJECTS_K) },
  { id:"S-2024-010", name:"Ibrahim Sirleaf",  admission:"KG-1416", guardian:"Yusuf Sirleaf",    contact:"+231 886 814 277", class:"KG-A",      marks: makeMarks(101, SUBJECTS_K) },
  { id:"S-2024-011", name:"Lovetta Doe",      admission:"KG-1417", guardian:"Bendu Doe",        contact:"+231 770 419 632", class:"KG-A",      marks: makeMarks(112, SUBJECTS_K) },
  { id:"S-2024-012", name:"Prince Kpannah",   admission:"KG-1418", guardian:"Tenneh Kpannah",   contact:"+231 886 207 144", class:"KG-A",      marks: makeMarks(123, SUBJECTS_K) },
  { id:"S-2024-013", name:"Hawa Bility",      admission:"G1-2105", guardian:"Abel Bility",      contact:"+231 886 410 552", class:"Grade 1",   marks: makeMarks(131, SUBJECTS_K) },
  { id:"S-2024-014", name:"Moses Kpoto",      admission:"G1-2106", guardian:"Esther Kpoto",     contact:"+231 770 339 814", class:"Grade 1",   marks: makeMarks(132, SUBJECTS_K) },
  { id:"S-2024-015", name:"Lucia Pewee",      admission:"G1-2107", guardian:"David Pewee",      contact:"+231 886 612 219", class:"Grade 1",   marks: makeMarks(133, SUBJECTS_K) },
  { id:"S-2024-016", name:"Tarnue Flomo",     admission:"G3B-3308",guardian:"Korpo Flomo",      contact:"+231 770 281 446", class:"Grade 3-B", marks: makeMarks(140, SUBJECTS_K) },
];

export const ROLE_LABEL: Record<string, string> = {
  principal: "Principal",
  vpa:       "Vice Principal — Academic",
  teacher:   "Teacher",
  sponsor:   "Class Sponsor",
};

export const ROLES_DATA: Record<string, AppUser> = {
  principal: {
    id:"U-PJ", name:"Principal Johnson", initials:"PJ", role:"Principal",
    summary:"Full system access · finalize approvals · override marks · manage users",
    perms:{ admin:true, allClasses:true, allSubjects:true, canApprove:true, canOverride:true, canFinalize:true, canManageUsers:true, canManageSubjects:true, viewAudit:true, viewAnalytics:true, viewPromo:"all" },
    assignedClasses:["KG-A","KG-B","Grade 1","Grade 3-A","Grade 3-B","Grade 5-A","Grade 7"],
    assignedSubjects: SUBJECTS_K,
  },
  vpa: {
    id:"U-MT", name:"Mrs. Tarr", initials:"MT", role:"Vice Principal — Academic",
    summary:"Approve / reject teacher submissions · override marks · manage subjects per assigned grades",
    perms:{ admin:true, allClasses:true, allSubjects:true, canApprove:true, canOverride:true, canManageSubjects:true, viewAudit:true, viewAnalytics:true, viewPromo:"all" },
    assignedClasses:["KG-A","KG-B","Grade 1","Grade 3-A","Grade 3-B","Grade 5-A","Grade 7"],
    assignedSubjects: SUBJECTS_K,
  },
  sponsor: {
    id:"U-AW", name:"Mrs. Wleh", initials:"AW", role:"Class Sponsor — KG-A",
    summary:"Owns FULL marks for KG-A · sign off per period · export class report cards · cannot enter marks",
    perms:{ sponsor:true, canSign:true, canExportClass:true, viewPromo:"own", viewAnalytics:"own" },
    assignedClasses:["KG-A"],
    assignedSubjects: SUBJECTS_K,
  },
  teacher: {
    id:"U-MC", name:"Mr. Cooper", initials:"MC", role:"Teacher · KG-A, Grade 1",
    summary:"Enters marks for assigned class × subject pairs only · submits to VPA · cannot edit after approval",
    perms:{ teacher:true, canSubmit:true },
    assignedClasses:["KG-A","Grade 1"],
    assignedSubjects:["Mathematics","Phonics","Science"],
  },
};

export const CLASSES: ClassRecord[] = [
  { id:"C-KGA",  name:"KG-A",      grade:"Kindergarten", sponsorId:"U-AW", students:12, room:"K-1" },
  { id:"C-KGB",  name:"KG-B",      grade:"Kindergarten", sponsorId:null,   students:10, room:"K-2" },
  { id:"C-G1",   name:"Grade 1",   grade:"Grade 1",      sponsorId:"U-EW", students:18, room:"P-1" },
  { id:"C-G2",   name:"Grade 2",   grade:"Grade 2",      sponsorId:null,   students:20, room:"P-2" },
  { id:"C-G3A",  name:"Grade 3-A", grade:"Grade 3",      sponsorId:"U-MN", students:22, room:"P-3" },
  { id:"C-G3B",  name:"Grade 3-B", grade:"Grade 3",      sponsorId:null,   students:21, room:"P-4" },
  { id:"C-G4",   name:"Grade 4",   grade:"Grade 4",      sponsorId:"U-RB", students:24, room:"P-5" },
  { id:"C-G5A",  name:"Grade 5-A", grade:"Grade 5",      sponsorId:"U-FK", students:23, room:"P-6" },
  { id:"C-G5B",  name:"Grade 5-B", grade:"Grade 5",      sponsorId:null,   students:19, room:"P-7" },
  { id:"C-G6",   name:"Grade 6",   grade:"Grade 6",      sponsorId:"U-CT", students:22, room:"P-8" },
  { id:"C-G7",   name:"Grade 7",   grade:"Grade 7",      sponsorId:"U-JK", students:25, room:"J-1" },
  { id:"C-G8",   name:"Grade 8",   grade:"Grade 8",      sponsorId:null,   students:23, room:"J-2" },
  { id:"C-G9",   name:"Grade 9",   grade:"Grade 9",      sponsorId:"U-PD", students:21, room:"J-3" },
  { id:"C-G10",  name:"Grade 10",  grade:"Grade 10",     sponsorId:"U-OK", students:20, room:"S-1" },
  { id:"C-G11",  name:"Grade 11",  grade:"Grade 11",     sponsorId:null,   students:17, room:"S-2" },
  { id:"C-G12",  name:"Grade 12",  grade:"Grade 12",     sponsorId:"U-BG", students:15, room:"S-3" },
];

export const USERS: UserRecord[] = [
  { id:"U-PJ", name:"Principal Johnson", email:"j.johnson@confidenceschool.lr", role:"principal", status:"active",   assignedClasses:[], assignedSubjects:[], lastLogin:"Today 09:14" },
  { id:"U-MT", name:"Mrs. Tarr",         email:"m.tarr@confidenceschool.lr",    role:"vpa",       status:"active",   assignedClasses:["KG-A","KG-B","Grade 1","Grade 2","Grade 3-A","Grade 3-B"], assignedSubjects:[], lastLogin:"Today 11:22" },
  { id:"U-AW", name:"Mrs. Wleh",         email:"a.wleh@confidenceschool.lr",    role:"sponsor",   status:"active",   assignedClasses:["KG-A"], assignedSubjects:[], lastLogin:"Today 08:40" },
  { id:"U-MC", name:"Mr. Cooper",        email:"m.cooper@confidenceschool.lr",  role:"teacher",   status:"active",   assignedClasses:["KG-A","Grade 1"], assignedSubjects:["Mathematics","Phonics","Science"], lastLogin:"Today 10:08" },
  { id:"U-EW", name:"Esther Williams",   email:"e.williams@confidenceschool.lr",role:"sponsor",   status:"active",   assignedClasses:["Grade 1"], assignedSubjects:[], lastLogin:"Yesterday 16:30" },
  { id:"U-MN", name:"Martha Nyemah",     email:"m.nyemah@confidenceschool.lr",  role:"sponsor",   status:"active",   assignedClasses:["Grade 3-A"], assignedSubjects:[], lastLogin:"Yesterday 15:10" },
  { id:"U-BL", name:"Beatrice Logan",    email:"b.logan@confidenceschool.lr",   role:"teacher",   status:"active",   assignedClasses:["Grade 3-A","Grade 3-B","Grade 4"], assignedSubjects:["English","Reading","Writing"], lastLogin:"Today 09:50" },
  { id:"U-AB", name:"Albert Bility",     email:"a.bility@confidenceschool.lr",  role:"teacher",   status:"active",   assignedClasses:["Grade 5-A","Grade 5-B","Grade 6"], assignedSubjects:["Science","Mathematics"], lastLogin:"Today 08:20" },
  { id:"U-MK", name:"Mary Kollie",       email:"m.kollie@confidenceschool.lr",  role:"teacher",   status:"inactive", assignedClasses:["Grade 7","Grade 8"], assignedSubjects:["S. Studies","Bible"], lastLogin:"May 10 14:00" },
];

export const AUDIT: AuditEvent[] = [
  { t:"Today 14:22",    who:"Mrs. Tarr (VPA)",      action:"approved marks for",       target:"KG-A · 3rd Period" },
  { t:"Today 11:08",    who:"Mr. Cooper (Teacher)",  action:"submitted marks for review",target:"KG-A · Science · 3rd Pd" },
  { t:"Yesterday 16:40",who:"Principal Johnson",     action:"overrode mark",             target:"Aminata Konneh · Math · Exam · 92 → 95", reason:"Re-grade after script review" },
  { t:"Yesterday 09:14",who:"Mr. Cooper",            action:"entered marks for",         target:"KG-A · Phonics · 3rd Pd (12 students)" },
  { t:"May 18 17:30",   who:"Principal Johnson",     action:"added subject",             target:"Civics → Grade 7" },
  { t:"May 18 09:00",   who:"Mrs. Tarr (VPA)",       action:"opened mark entry window",  target:"3rd Period · all grades" },
  { t:"May 17 14:22",   who:"Mr. Cooper",            action:"locked marks for",          target:"Mathematics · 2nd Period" },
  { t:"May 17 10:08",   who:"Ms. Wleh",              action:"entered marks for",         target:"Grade 3-B · English · 2nd Pd (24 students)" },
  { t:"May 16 16:30",   who:"Principal Johnson",     action:"created user account",      target:"Mr. Bility · Teacher · Grade 5-A" },
  { t:"May 16 09:14",   who:"Mrs. Tarr (VPA)",       action:"rejected submission",       target:"Grade 7 · Bible · 2nd Pd", reason:"Three students missing marks" },
  { t:"May 15 13:45",   who:"Principal Johnson",     action:"updated grading scale",     target:"Below 70 label: 'Failing' → 'Not at This Time'" },
];
