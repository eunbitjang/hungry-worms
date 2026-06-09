-- ============================================================
-- Hungry Worms — Supabase Schema
-- Run this entire file in the Supabase SQL Editor (once).
-- ============================================================

-- ── 1. CLIENTS ──────────────────────────────────────────────
-- One row per client organisation (matches canonical names in the Google Sheet).
create table if not exists clients (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,  -- e.g. "Willowbank Wildlife Reserve"
  created_at  timestamptz not null default now()
);

-- Pre-populate with all current clients from the Master Log
insert into clients (name) values
  ('Willowbank Wildlife Reserve'),
  ('The Russley Village'),
  ('Sudima Christchurch City Hotel'),
  ('Sudima Christchurch Airport Hotel'),
  ('Ballantynes Department Store Christchurch'),
  ('Cotswold Scenic Circle Hotel'),
  ('Mitre 10 MEGA Papanui')
on conflict (name) do nothing;


-- ── 2. PROFILES ─────────────────────────────────────────────
-- Maps each Supabase auth user to a client organisation.
-- Multiple staff per client = multiple rows with the same client_id.
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  client_id     uuid references clients(id) on delete set null,
  contact_name  text,
  email         text not null,
  is_staff      boolean not null default false,  -- true = Hungry Worms internal, bypasses client filter
  created_at    timestamptz not null default now()
);


-- ── 3. WASTE_LOG ─────────────────────────────────────────────
-- One row per pickup. Synced from Google Sheets every ~15 min.
-- CO₂e and car-equivalent columns are computed and stored (never stale).
create table if not exists waste_log (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references clients(id) on delete cascade,
  pickup_date     date not null,
  location_site   text,
  waste_type      text,
  bin_number      text,
  weight_kg       numeric(10, 2) not null,
  -- Impact formulas (DATA_AND_SHEET.md — keep identical everywhere)
  co2e_kg         numeric(10, 2) generated always as (weight_kg * 2.5) stored,
  car_equiv_year  numeric(10, 4) generated always as (weight_kg * 2.5 / 4600) stored,
  car_equiv_month numeric(10, 4) generated always as (weight_kg * 2.5 * 12 / 4600) stored,
  notes           text,
  synced_at       timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

-- Indexes for common query patterns
create index if not exists waste_log_client_id_idx    on waste_log (client_id);
create index if not exists waste_log_pickup_date_idx  on waste_log (pickup_date desc);
create index if not exists waste_log_client_date_idx  on waste_log (client_id, pickup_date desc);


-- ── 4. ROW LEVEL SECURITY ────────────────────────────────────
alter table clients    enable row level security;
alter table profiles   enable row level security;
alter table waste_log  enable row level security;

-- profiles: each user sees only their own row
create policy "profiles: own row only"
  on profiles for select
  using (auth.uid() = id);

-- clients: users see only their own client; staff see all
create policy "clients: own client or staff"
  on clients for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and (profiles.client_id = clients.id or profiles.is_staff = true)
    )
  );

-- waste_log: users see only their client's rows; staff see all
create policy "waste_log: own client or staff"
  on waste_log for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and (profiles.client_id = waste_log.client_id or profiles.is_staff = true)
    )
  );

-- ── 5. PUBLIC AGGREGATE VIEW (hero KPIs) ────────────────────
-- A simple view for the public marketing hero numbers.
-- Returns company-wide totals — no per-client data exposed.
create or replace view public_impact_totals as
  select
    sum(weight_kg)        as total_waste_kg,
    sum(co2e_kg)          as total_co2e_kg,
    sum(car_equiv_year)   as total_cars_year
  from waste_log;

-- Allow anonymous (public) reads on this view only
grant select on public_impact_totals to anon;
