create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  content_key text not null check (content_key in ('hanbok', 'world', 'cosplay', 'stage')),
  category text not null,
  name text not null,
  thumbnail text not null default '',
  images jsonb not null default '[]'::jsonb,
  history text not null default '',
  description text not null default '',
  short_desc text not null default '',
  composition text not null default '',
  sizes jsonb not null default '["S","M","L"]'::jsonb,
  rental_period text not null default '2박 3일',
  price integer not null default 0,
  rating numeric(2,1) not null default 5,
  review_count integer not null default 0,
  hot boolean not null default false,
  deleted boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.products enable row level security;

create policy "admins can read own role" on public.admin_users for select to authenticated using (user_id = auth.uid());
create policy "products are public" on public.products for select using (true);
create policy "admins insert products" on public.products for insert to authenticated with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "admins update products" on public.products for update to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid())) with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "admins delete products" on public.products for delete to authenticated using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Supabase Authentication > Users에서 본인 계정을 만든 뒤 아래 SQL을 한 번 실행하세요.
-- insert into public.admin_users(user_id)
-- select id from auth.users where email = '본인이메일@example.com';
