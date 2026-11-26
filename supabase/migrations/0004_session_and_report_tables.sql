-- 0004_session_and_report_tables.sql
-- Mock interview sessions
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id uuid not null references public.tracks(id) on delete restrict,
  format_id uuid not null references public.formats(id) on delete restrict,
  level text not null default 'mid',
  company_id uuid references public.companies(id) on delete set null,
  job_description text,
  duration_target integer not null default 10,
  difficulty text not null default 'realistic' check (difficulty in ('warm-up', 'realistic', 'tough')),
  persona text not null default 'neutral' check (persona in ('friendly', 'neutral', 'skeptical')),
  question_plan jsonb not null default '[]'::jsonb,
  status text not null default 'setup' check (status in ('setup', 'live', 'processing', 'done', 'failed')),
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists sessions_user_id_idx on public.sessions(user_id);
create index if not exists sessions_status_idx on public.sessions(status);

-- Transcript turns
create table if not exists public.session_turns (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  idx integer not null,
  speaker text not null check (speaker in ('ai', 'user')),
  question_id uuid references public.questions(id) on delete set null,
  text text not null,
  start_ms integer not null default 0,
  end_ms integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists session_turns_session_id_idx on public.session_turns(session_id, idx);

-- Session artifacts (audio/video/code/board/scratchpad)
create table if not exists public.session_artifacts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  kind text not null check (kind in ('audio', 'video', 'code', 'board', 'scratchpad')),
  path text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Feedback reports
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.sessions(id) on delete cascade,
  overall_score integer check (overall_score >= 0 and overall_score <= 100),
  hire_signal text check (hire_signal in ('Strong no', 'No', 'Lean no', 'Lean yes', 'Yes', 'Strong yes')),
  rubric_scores jsonb not null default '[]'::jsonb,
  per_question jsonb not null default '[]'::jsonb,
  delivery jsonb not null default '{}'::jsonb,
  content jsonb not null default '{}'::jsonb,
  top_fixes jsonb not null default '[]'::jsonb,
  model_version text not null default '',
  prompt_version text not null default '',
  status text not null default 'processing' check (status in ('processing', 'done', 'failed')),
  error_message text,
  share_token text unique,
  is_shared boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Single-question drills
create table if not exists public.drills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  source_report_id uuid references public.reports(id) on delete set null,
  attempt_text text not null,
  score integer check (score >= 1 and score <= 5),
  feedback jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists drills_user_id_idx on public.drills(user_id);

-- Usage events (AI cost & minutes metering)
create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('live_minutes', 'report', 'drill')),
  amount numeric not null default 0,
  cost_usd numeric not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Updated_at triggers
create trigger sessions_updated_at before update on public.sessions
  for each row execute function public.update_updated_at_column();
create trigger session_turns_updated_at before update on public.session_turns
  for each row execute function public.update_updated_at_column();
create trigger session_artifacts_updated_at before update on public.session_artifacts
  for each row execute function public.update_updated_at_column();
create trigger reports_updated_at before update on public.reports
  for each row execute function public.update_updated_at_column();
create trigger drills_updated_at before update on public.drills
  for each row execute function public.update_updated_at_column();
create trigger usage_events_updated_at before update on public.usage_events
  for each row execute function public.update_updated_at_column();
