create table if not exists sites (
  id text primary key,
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  admin_key text not null,
  theme jsonb not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sections (
  id text primary key,
  site_id text not null references sites(id) on delete cascade,
  type text not null,
  position integer not null,
  visible boolean not null default true,
  data jsonb not null default '{}'::jsonb
);

create index if not exists sections_site_id_idx on sections (site_id);
