-- ============================================================
-- Confidence School System — Marks Management
-- Supabase PostgreSQL Schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. Profiles (extends auth.users)
-- ============================================================
create table public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  name          text not null,
  role          text not null check (role in ('principal','vpa','teacher','sponsor')),
  status        text not null default 'active' check (status in ('active','inactive')),
  initials      text generated always as (
    upper(substring(name from 1 for 1) || coalesce(substring(name from position(' ' in name)+1 for 1), ''))
  ) stored,
  created_at    timestamptz default now(),
  last_login    timestamptz
);
alter table public.profiles enable row level security;
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Principal can manage all profiles" on public.profiles using (
  exists(select 1 from public.profiles where id = auth.uid() and role = 'principal')
);

-- ============================================================
-- 2. Academic Years
-- ============================================================
create table public.academic_years (
  id          uuid primary key default uuid_generate_v4(),
  label       text not null unique,   -- e.g. "2024-2025"
  is_current  boolean not null default false,
  created_at  timestamptz default now()
);
-- Only one year can be current
create unique index one_current_year on public.academic_years(is_current) where is_current = true;
alter table public.academic_years enable row level security;
create policy "All authenticated users can read years" on public.academic_years for select using (auth.role() = 'authenticated');

-- ============================================================
-- 3. Grades
-- ============================================================
create table public.grades (
  id    uuid primary key default uuid_generate_v4(),
  name  text not null unique,    -- e.g. "Grade 5", "Kindergarten"
  level text not null            -- "K" | "1"-"12"
);
alter table public.grades enable row level security;
create policy "All authenticated users can read grades" on public.grades for select using (auth.role() = 'authenticated');

-- ============================================================
-- 4. Classes
-- ============================================================
create table public.classes (
  id          uuid primary key default uuid_generate_v4(),
  grade_id    uuid references public.grades(id),
  name        text not null,      -- e.g. "KG-A"
  room        text,
  sponsor_id  uuid references public.profiles(id),
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);
alter table public.classes enable row level security;
create policy "All authenticated users can read classes" on public.classes for select using (auth.role() = 'authenticated');
create policy "Principal and VPA can manage classes" on public.classes using (
  exists(select 1 from public.profiles where id = auth.uid() and role in ('principal','vpa'))
);

-- ============================================================
-- 5. User → Class assignments
-- ============================================================
create table public.user_class_assignments (
  user_id   uuid references public.profiles(id) on delete cascade,
  class_id  uuid references public.classes(id)  on delete cascade,
  primary key (user_id, class_id)
);
alter table public.user_class_assignments enable row level security;
create policy "Users can read their own assignments" on public.user_class_assignments for select using (auth.uid() = user_id);
create policy "Principal can manage assignments" on public.user_class_assignments using (
  exists(select 1 from public.profiles where id = auth.uid() and role = 'principal')
);

-- ============================================================
-- 6. Subjects (scoped per grade)
-- ============================================================
create table public.subjects (
  id            uuid primary key default uuid_generate_v4(),
  grade_id      uuid references public.grades(id),
  name          text not null,
  is_active     boolean not null default true,
  display_order int not null default 0,
  created_by    uuid references public.profiles(id),
  created_at    timestamptz default now()
);
alter table public.subjects enable row level security;
create policy "All authenticated users can read subjects" on public.subjects for select using (auth.role() = 'authenticated');
create policy "Principal and VPA can manage subjects" on public.subjects using (
  exists(select 1 from public.profiles where id = auth.uid() and role in ('principal','vpa'))
);

-- ============================================================
-- 7. User → Subject assignments (teachers)
-- ============================================================
create table public.user_subject_assignments (
  user_id    uuid references public.profiles(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  primary key (user_id, subject_id)
);
alter table public.user_subject_assignments enable row level security;
create policy "Users can read own subject assignments" on public.user_subject_assignments for select using (auth.uid() = user_id);

-- ============================================================
-- 8. Students
-- ============================================================
create table public.students (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  admission_no  text not null unique,
  class_id      uuid references public.classes(id),
  guardian_name text,
  contact       text,
  is_archived   boolean not null default false,
  created_at    timestamptz default now()
);
alter table public.students enable row level security;
create policy "Teachers/sponsors can read students in their classes" on public.students for select using (
  exists(
    select 1 from public.user_class_assignments uca
    where uca.user_id = auth.uid() and uca.class_id = students.class_id
  ) or exists(
    select 1 from public.profiles where id = auth.uid() and role in ('principal','vpa')
  )
);
create policy "Principal and VPA can manage students" on public.students using (
  exists(select 1 from public.profiles where id = auth.uid() and role in ('principal','vpa'))
);

-- ============================================================
-- 9. Periods (1st Pd through Sem 2 Exam per academic year)
-- ============================================================
create table public.periods (
  id               uuid primary key default uuid_generate_v4(),
  academic_year_id uuid references public.academic_years(id),
  name             text not null,   -- "1st Pd", "2nd Pd", ..., "Sem 2 Exam"
  semester         int not null check (semester in (1,2)),
  is_exam          boolean not null default false,
  sequence         int not null,    -- 1-8 ordering
  is_open          boolean not null default false,
  created_at       timestamptz default now()
);
alter table public.periods enable row level security;
create policy "All authenticated users can read periods" on public.periods for select using (auth.role() = 'authenticated');

-- ============================================================
-- 10. Marks (core fact table)
-- ============================================================
create table public.marks (
  id              uuid primary key default uuid_generate_v4(),
  student_id      uuid references public.students(id) on delete cascade,
  subject_id      uuid references public.subjects(id),
  period_id       uuid references public.periods(id),
  score           int check (score >= 0 and score <= 100),
  entered_by      uuid references public.profiles(id),
  approved_by     uuid references public.profiles(id),
  locked_at       timestamptz,
  override_reason text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique (student_id, subject_id, period_id)
);
alter table public.marks enable row level security;
create policy "Teachers can read/write marks for their assigned class/subject" on public.marks for all using (
  exists(
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('principal','vpa')
  ) or (
    exists(
      select 1 from public.students s
      join public.user_class_assignments uca on uca.class_id = s.class_id
      where s.id = marks.student_id and uca.user_id = auth.uid()
    ) and exists(
      select 1 from public.user_subject_assignments usa
      where usa.subject_id = marks.subject_id and usa.user_id = auth.uid()
    )
  )
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;
create trigger marks_updated_at before update on public.marks for each row execute function update_updated_at();

-- ============================================================
-- 11. Report Cards (computed per student per year)
-- ============================================================
create table public.report_cards (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid references public.students(id) on delete cascade,
  year_id     uuid references public.academic_years(id),
  sem1_avg    numeric(5,2),
  sem2_avg    numeric(5,2),
  yearly_avg  numeric(5,2),
  rank        int,
  conduct     text,
  status      text not null default 'draft' check (status in ('draft','approved')),
  created_at  timestamptz default now(),
  unique (student_id, year_id)
);
alter table public.report_cards enable row level security;
create policy "Principals and VPAs can manage report cards" on public.report_cards using (
  exists(select 1 from public.profiles where id = auth.uid() and role in ('principal','vpa'))
);
create policy "Sponsors can read report cards for their class" on public.report_cards for select using (
  exists(
    select 1 from public.students s
    join public.user_class_assignments uca on uca.class_id = s.class_id
    where s.id = report_cards.student_id and uca.user_id = auth.uid()
  )
);

-- ============================================================
-- 12. Promotional Statements
-- ============================================================
create table public.promotional_statements (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid references public.students(id) on delete cascade,
  year_id     uuid references public.academic_years(id),
  decision    text not null check (decision in ('promoted','retained','conditioned')),
  next_grade  text,
  signed_by   uuid references public.profiles(id),
  signed_at   timestamptz,
  created_at  timestamptz default now(),
  unique (student_id, year_id)
);
alter table public.promotional_statements enable row level security;
create policy "Principals can manage promotional statements" on public.promotional_statements using (
  exists(select 1 from public.profiles where id = auth.uid() and role = 'principal')
);
create policy "VPAs and sponsors can read promotional statements" on public.promotional_statements for select using (
  exists(select 1 from public.profiles where id = auth.uid() and role in ('principal','vpa','sponsor'))
);

-- ============================================================
-- 13. Audit Log (immutable)
-- ============================================================
create table public.audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id),
  action      text not null,
  entity_type text not null,
  entity_id   uuid,
  old_value   jsonb,
  new_value   jsonb,
  reason      text,
  created_at  timestamptz default now()
);
alter table public.audit_logs enable row level security;
create policy "Principal and VPA can read audit logs" on public.audit_logs for select using (
  exists(select 1 from public.profiles where id = auth.uid() and role in ('principal','vpa'))
);
create policy "System can insert audit logs" on public.audit_logs for insert with check (auth.role() = 'authenticated');

-- ============================================================
-- 14. Seed data — Grades
-- ============================================================
insert into public.grades (name, level) values
  ('Kindergarten','K'),
  ('Grade 1','1'),('Grade 2','2'),('Grade 3','3'),('Grade 4','4'),
  ('Grade 5','5'),('Grade 6','6'),('Grade 7','7'),('Grade 8','8'),
  ('Grade 9','9'),('Grade 10','10'),('Grade 11','11'),('Grade 12','12')
on conflict do nothing;

-- ============================================================
-- 15. Seed data — Current Academic Year + Periods
-- ============================================================
insert into public.academic_years (label, is_current) values ('2024-2025', true)
on conflict do nothing;

-- Insert periods for 2024-2025 year (run after year is inserted)
do $$ declare year_id uuid := (select id from public.academic_years where label = '2024-2025');
begin
  insert into public.periods (academic_year_id, name, semester, is_exam, sequence, is_open) values
    (year_id, '1st Pd',     1, false, 1, false),
    (year_id, '2nd Pd',     1, false, 2, false),
    (year_id, '3rd Pd',     1, false, 3, true),   -- currently open
    (year_id, 'Sem 1 Exam', 1, true,  4, false),
    (year_id, '4th Pd',     2, false, 5, false),
    (year_id, '5th Pd',     2, false, 6, false),
    (year_id, '6th Pd',     2, false, 7, false),
    (year_id, 'Sem 2 Exam', 2, true,  8, false)
  on conflict do nothing;
end $$;

-- ============================================================
-- 16. Seed data — Kindergarten Subjects
-- ============================================================
do $$ declare kg_id uuid := (select id from public.grades where name = 'Kindergarten');
begin
  insert into public.subjects (grade_id, name, is_active, display_order) values
    (kg_id, 'Mathematics',    true,  1),
    (kg_id, 'English',        true,  2),
    (kg_id, 'Phonics',        true,  3),
    (kg_id, 'Science',        true,  4),
    (kg_id, 'Reading',        true,  5),
    (kg_id, 'S. Studies',     true,  6),
    (kg_id, 'Bible',          true,  7),
    (kg_id, 'Spelling',       true,  8),
    (kg_id, 'Rhymes',         true,  9),
    (kg_id, 'Writing',        true, 10),
    (kg_id, 'Hygiene',        true, 11),
    (kg_id, 'Arts',           true, 12),
    (kg_id, 'Shapes & Colors',true, 13),
    (kg_id, 'Alphabet',       true, 14),
    (kg_id, 'P.E.',           true, 15)
  on conflict do nothing;
end $$;
