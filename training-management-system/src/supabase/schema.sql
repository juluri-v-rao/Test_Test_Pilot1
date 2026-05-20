create extension if not exists "pgcrypto";

create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  image text,
  progress numeric default 0 check (progress >= 0 and progress <= 100),
  skill_score numeric default 0 check (skill_score >= 0 and skill_score <= 100),
  status text default 'On Track',
  join_date date,
  remarks text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text,
  deadline date,
  weightage numeric default 0 check (weightage >= 0 and weightage <= 100),
  completion numeric default 0 check (completion >= 0 and completion <= 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists employee_modules (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade,
  module_id uuid references modules(id) on delete cascade,
  progress numeric default 0 check (progress >= 0 and progress <= 100),
  completion numeric default 0 check (completion >= 0 and completion <= 100),
  updated_at timestamptz default now(),
  unique (employee_id, module_id)
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id) on delete cascade,
  feedback text not null,
  reviewer text not null,
  month text not null,
  created_at timestamptz default now()
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists employees_set_updated_at on employees;
create trigger employees_set_updated_at before update on employees for each row execute function set_updated_at();

drop trigger if exists modules_set_updated_at on modules;
create trigger modules_set_updated_at before update on modules for each row execute function set_updated_at();

alter publication supabase_realtime add table employees;
alter publication supabase_realtime add table modules;
alter publication supabase_realtime add table employee_modules;
alter publication supabase_realtime add table reviews;

alter table employees enable row level security;
alter table modules enable row level security;
alter table employee_modules enable row level security;
alter table reviews enable row level security;

drop policy if exists "Public read employees" on employees;
create policy "Public read employees" on employees for select using (true);
drop policy if exists "Public read modules" on modules;
create policy "Public read modules" on modules for select using (true);
drop policy if exists "Public read employee_modules" on employee_modules;
create policy "Public read employee_modules" on employee_modules for select using (true);
drop policy if exists "Public read reviews" on reviews;
create policy "Public read reviews" on reviews for select using (true);

-- For the simple single-password requirement, the frontend hides editing until the
-- password is entered. To allow those edits with the anon key, enable these write
-- policies. For stricter production security, move writes behind a Supabase Edge
-- Function that validates VITE_ADMIN_PASSWORD server-side and keep these disabled.
drop policy if exists "Admin ui writes employees" on employees;
create policy "Admin ui writes employees" on employees for all using (true) with check (true);
drop policy if exists "Admin ui writes modules" on modules;
create policy "Admin ui writes modules" on modules for all using (true) with check (true);
drop policy if exists "Admin ui writes employee_modules" on employee_modules;
create policy "Admin ui writes employee_modules" on employee_modules for all using (true) with check (true);
drop policy if exists "Admin ui writes reviews" on reviews;
create policy "Admin ui writes reviews" on reviews for all using (true) with check (true);
