-- 0003_user_profile_tables.sql
-- User profiles
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  target_role text,
  level text check (level in ('intern', 'junior', 'mid', 'senior', 'staff_lead', 'manager', 'executive')),
  target_companies text[] not null default '{}',
  interview_date date,
  ui_language text not null default 'en',
  interview_language text not null default 'en',
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  onboarding_done boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Resumes
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_path text not null,
  parsed_json jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Structured experiences
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete set null,
  title text not null,
  org text not null,
  start_date text,
  end_date text,
  bullets jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Story Bank (STAR builder)
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  situation text not null default '',
  task text not null default '',
  action text not null default '',
  result text not null default '',
  learning text not null default '',
  metrics text not null default '',
  competencies text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Saved question lists
create table if not exists public.saved_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  question_ids uuid[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at triggers
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();
create trigger resumes_updated_at before update on public.resumes
  for each row execute function public.update_updated_at_column();
create trigger experiences_updated_at before update on public.experiences
  for each row execute function public.update_updated_at_column();
create trigger stories_updated_at before update on public.stories
  for each row execute function public.update_updated_at_column();
create trigger saved_lists_updated_at before update on public.saved_lists
  for each row execute function public.update_updated_at_column();
