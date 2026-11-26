-- 0006_storage_buckets.sql
-- Private storage buckets: resumes, recordings, artifacts
insert into storage.buckets (id, name, public)
values
  ('resumes', 'resumes', false),
  ('recordings', 'recordings', false),
  ('artifacts', 'artifacts', false)
on conflict (id) do nothing;

-- Owner-only storage policies (files stored under <user_id>/...)
create policy "Users manage own resumes files" on storage.objects
  for all using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users manage own recordings files" on storage.objects
  for all using (bucket_id = 'recordings' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'recordings' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users manage own artifacts files" on storage.objects
  for all using (bucket_id = 'artifacts' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'artifacts' and auth.uid()::text = (storage.foldername(name))[1]);
