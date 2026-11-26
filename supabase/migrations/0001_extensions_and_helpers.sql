-- 0001_extensions_and_helpers.sql
-- Enable required extensions
create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- Shared updated_at trigger function
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;
