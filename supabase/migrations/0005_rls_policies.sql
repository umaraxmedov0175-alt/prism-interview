-- 0005_rls_policies.sql
-- Enable RLS on every table
alter table public.tracks enable row level security;
alter table public.formats enable row level security;
alter table public.competencies enable row level security;
alter table public.companies enable row level security;
alter table public.rubrics enable row level security;
alter table public.questions enable row level security;
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.experiences enable row level security;
alter table public.stories enable row level security;
alter table public.saved_lists enable row level security;
alter table public.sessions enable row level security;
alter table public.session_turns enable row level security;
alter table public.session_artifacts enable row level security;
alter table public.reports enable row level security;
alter table public.drills enable row level security;
alter table public.usage_events enable row level security;

-- Public read for taxonomy & public questions
create policy "Public read tracks" on public.tracks for select using (true);
create policy "Public read formats" on public.formats for select using (true);
create policy "Public read competencies" on public.competencies for select using (true);
create policy "Public read companies" on public.companies for select using (true);
create policy "Public read rubrics" on public.rubrics for select using (true);
create policy "Public read public questions" on public.questions for select using (is_public = true);

-- User-owned tables: strict user_id = auth.uid()
create policy "Users manage own profile" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own resumes" on public.resumes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own experiences" on public.experiences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own stories" on public.stories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own saved_lists" on public.saved_lists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own sessions" on public.sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own session_turns" on public.session_turns
  for all using (
    exists (
      select 1 from public.sessions s
      where s.id = session_turns.session_id and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.sessions s
      where s.id = session_turns.session_id and s.user_id = auth.uid()
    )
  );

create policy "Users manage own session_artifacts" on public.session_artifacts
  for all using (
    exists (
      select 1 from public.sessions s
      where s.id = session_artifacts.session_id and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.sessions s
      where s.id = session_artifacts.session_id and s.user_id = auth.uid()
    )
  );

create policy "Users read own reports" on public.reports
  for select using (
    exists (
      select 1 from public.sessions s
      where s.id = reports.session_id and s.user_id = auth.uid()
    )
    or (is_shared = true)
  );

create policy "Users manage own reports" on public.reports
  for insert with check (
    exists (
      select 1 from public.sessions s
      where s.id = reports.session_id and s.user_id = auth.uid()
    )
  );

create policy "Users update own reports" on public.reports
  for update using (
    exists (
      select 1 from public.sessions s
      where s.id = reports.session_id and s.user_id = auth.uid()
    )
  );

create policy "Users manage own drills" on public.drills
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read own usage_events" on public.usage_events
  for select using (auth.uid() = user_id);
