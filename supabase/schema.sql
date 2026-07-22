-- JBE Operations Database Schema
-- Run this in Supabase Dashboard → SQL Editor
-- Last updated: 2026-07-22

-- ─── Customers ──────────────────────────────────────────────────────────────
-- Suppliers who bring scrap to the warehouse.
create table if not exists customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  address     text,
  created_at  timestamptz not null default now()
);

-- ─── Purchases ───────────────────────────────────────────────────────────────
-- One row per customer visit / transaction.
-- status: draft = weighed, not yet settled | complete = paperwork done, customer paid/credited
create table if not exists purchases (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid not null references customers(id),
  purchase_date date not null default current_date,
  status        text not null default 'draft' check (status in ('draft', 'complete')),
  notes         text,
  created_at    timestamptz not null default now()
);

-- ─── Purchase Items ───────────────────────────────────────────────────────────
-- One row per metal type within a purchase.
-- net_weight and amount are computed so they are always consistent with inputs.
create table if not exists purchase_items (
  id                uuid primary key default gen_random_uuid(),
  purchase_id       uuid not null references purchases(id) on delete cascade,
  metal_type        text not null check (metal_type in ('AL', 'CU', 'BR', 'OTHER')),
  gross_weight      numeric(10, 3) not null check (gross_weight >= 0),
  sacks_count       integer not null default 0 check (sacks_count >= 0),
  deduction_weight  numeric(10, 3) not null default 0 check (deduction_weight >= 0),
  net_weight        numeric(10, 3) generated always as (gross_weight - deduction_weight) stored,
  rate              numeric(10, 2) not null check (rate >= 0),
  amount            numeric(12, 2) generated always as ((gross_weight - deduction_weight) * rate) stored,
  -- before = rate agreed before weighing, after = rate set once weight is known
  rate_timing       text not null default 'before' check (rate_timing in ('before', 'after')),
  created_at        timestamptz not null default now()
);

-- ─── Payments ─────────────────────────────────────────────────────────────────
-- A purchase can have multiple payments (e.g. partial cash + rest on credit).
create table if not exists payments (
  id            uuid primary key default gen_random_uuid(),
  purchase_id   uuid not null references purchases(id) on delete cascade,
  amount        numeric(12, 2) not null check (amount > 0),
  payment_type  text not null check (payment_type in ('cash', 'credit')),
  payment_date  date not null default current_date,
  notes         text,
  created_at    timestamptz not null default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists purchases_customer_id_idx  on purchases(customer_id);
create index if not exists purchases_date_idx         on purchases(purchase_date desc);
create index if not exists purchase_items_purchase_idx on purchase_items(purchase_id);
create index if not exists payments_purchase_idx      on payments(purchase_id);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Enabled but open for now (auth added in a later phase).
-- Tighten these policies once login is implemented.
alter table customers      enable row level security;
alter table purchases      enable row level security;
alter table purchase_items enable row level security;
alter table payments       enable row level security;

create policy "allow all" on customers      for all using (true);
create policy "allow all" on purchases      for all using (true);
create policy "allow all" on purchase_items for all using (true);
create policy "allow all" on payments       for all using (true);
