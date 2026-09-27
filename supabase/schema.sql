-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
-- It creates one shared watchlist. There is no login; the anon key can
-- read and write this table on purpose.

create table if not exists public.watchlist (
  movie_id integer primary key,
  title text not null,
  poster_url text,
  watched boolean not null default false,
  date_added timestamptz not null default now()
);

alter table public.watchlist enable row level security;

grant select, insert, update, delete on table public.watchlist to anon, authenticated;

drop policy if exists "Anyone can read the watchlist" on public.watchlist;
create policy "Anyone can read the watchlist"
  on public.watchlist
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can add to the watchlist" on public.watchlist;
create policy "Anyone can add to the watchlist"
  on public.watchlist
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Anyone can update the watchlist" on public.watchlist;
create policy "Anyone can update the watchlist"
  on public.watchlist
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Anyone can remove from the watchlist" on public.watchlist;
create policy "Anyone can remove from the watchlist"
  on public.watchlist
  for delete
  to anon, authenticated
  using (true);
