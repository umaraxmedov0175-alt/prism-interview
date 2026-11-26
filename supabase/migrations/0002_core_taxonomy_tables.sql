-- 0002_core_taxonomy_tables.sql
-- Tracks (what is tested)
create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  rubric_id uuid,
  tools text[] not null default '{}',
  is_mvp boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Formats (how the interview runs)
create table if not exists public.formats (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Competencies
create table if not exists public.competencies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Companies (only facts with cited sources; unverified marked clearly)
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  logo_path text,
  process jsonb not null default '{}'::jsonb,
  values jsonb not null default '[]'::jsonb,
  sources jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Rubrics (1-5 weighted dimensions)
create table if not exists public.rubrics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  track_id uuid references public.tracks(id) on delete set null,
  dimensions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Add FK from tracks.rubric_id -> rubrics.id
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'tracks_rubric_id_fkey'
  ) then
    alter table public.tracks
      add constraint tracks_rubric_id_fkey
      foreign key (rubric_id) references public.rubrics(id) on delete set null;
  end if;
end $$;

-- Questions (with pgvector 768-dim embedding)
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  track_id uuid not null references public.tracks(id) on delete cascade,
  text text not null,
  category text not null,
  competencies text[] not null default '{}',
  level_min text not null default 'intern',
  level_max text not null default 'executive',
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  company_ids uuid[] not null default '{}',
  why_asked text not null default '',
  strong_answer_points jsonb not null default '[]'::jsonb,
  common_mistakes jsonb not null default '[]'::jsonb,
  follow_ups jsonb not null default '[]'::jsonb,
  embedding vector(768),
  is_public boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists questions_track_id_idx on public.questions(track_id);
create index if not exists questions_difficulty_idx on public.questions(difficulty);
create index if not exists questions_is_public_idx on public.questions(is_public);

-- Updated_at triggers
create trigger tracks_updated_at before update on public.tracks
  for each row execute function public.update_updated_at_column();
create trigger formats_updated_at before update on public.formats
  for each row execute function public.update_updated_at_column();
create trigger competencies_updated_at before update on public.competencies
  for each row execute function public.update_updated_at_column();
create trigger companies_updated_at before update on public.companies
  for each row execute function public.update_updated_at_column();
create trigger rubrics_updated_at before update on public.rubrics
  for each row execute function public.update_updated_at_column();
create trigger questions_updated_at before update on public.questions
  for each row execute function public.update_updated_at_column();
