-- Run this in the Supabase SQL editor
-- https://supabase.com/dashboard/project/_/sql

create table if not exists xp_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  source      text not null,       -- 'mission' | 'achievement' (future)
  source_key  text not null,       -- e.g. 'log_today_2026-03-23'
  xp          int  not null,
  created_at  timestamptz default now(),

  unique (user_id, source_key)     -- prevents double-counting
);

alter table xp_events enable row level security;

create policy "Users can read own xp_events"
  on xp_events for select
  using (auth.uid() = user_id);

create policy "Users can insert own xp_events"
  on xp_events for insert
  with check (auth.uid() = user_id);

-- Index for fast per-user lookups
create index if not exists xp_events_user_id_idx on xp_events (user_id);
