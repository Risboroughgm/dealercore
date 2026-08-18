-- DealerCore V1 Supabase schema
create extension if not exists pgcrypto;

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text default '',
  phone text default '',
  email text default '',
  address text default '',
  postcode text default '',
  notes text default '',
  created_at timestamptz not null default now()
);

create table if not exists equipment (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  make text default '', model text default '', type text default '', serial text default '', notes text default '',
  created_at timestamptz not null default now()
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  number text unique not null,
  customer_id uuid references customers(id) on delete set null,
  status text not null default 'Draft',
  notes text default '',
  created_at timestamptz not null default now()
);

create table if not exists quote_lines (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  description text not null default '', qty numeric(12,2) not null default 1,
  unit numeric(12,2) not null default 0, vat numeric(6,2) not null default 20
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  number text unique not null,
  customer_id uuid references customers(id) on delete set null,
  status text not null default 'Unpaid',
  notes text default '', due_date date,
  created_at timestamptz not null default now()
);

create table if not exists invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null default '', qty numeric(12,2) not null default 1,
  unit numeric(12,2) not null default 0, vat numeric(6,2) not null default 20
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  amount numeric(12,2) not null,
  payment_date date not null default current_date,
  method text default 'Bank transfer',
  created_at timestamptz not null default now()
);

create table if not exists workshop_jobs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  equipment_id uuid references equipment(id) on delete set null,
  machine text not null default '', serial text default '', work_required text default '',
  status text not null default 'Booked', labour_hours numeric(8,2) default 0,
  labour_rate numeric(10,2) default 0, parts_cost numeric(12,2) default 0,
  parts_sell numeric(12,2) default 0, due_date date, notes text default '',
  created_at timestamptz not null default now()
);

create table if not exists diary_items (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  title text not null, type text default 'Follow-up', activity_date date not null,
  activity_time time, notes text default '', done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null, contact text default '', phone text default '', email text default '',
  account_no text default '', notes text default '', created_at timestamptz not null default now()
);

create table if not exists stock_items (
  id uuid primary key default gen_random_uuid(),
  sku text default '', description text not null,
  qty numeric(12,2) not null default 0, cost numeric(12,2) not null default 0,
  sell numeric(12,2) not null default 0,
  supplier_id uuid references suppliers(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists equipment_customer_idx on equipment(customer_id);
create index if not exists quotes_customer_idx on quotes(customer_id);
create index if not exists invoices_customer_idx on invoices(customer_id);
create index if not exists workshop_customer_idx on workshop_jobs(customer_id);
create index if not exists diary_date_idx on diary_items(activity_date);

-- RLS should be enabled when authentication is added. Do not expose service-role keys in the browser.
