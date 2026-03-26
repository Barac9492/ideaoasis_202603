-- IdeaOasis Supabase Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
--
-- Prerequisites:
--   1. Create a Supabase project at https://supabase.com
--   2. Copy project URL and anon key to .env
--   3. Run this SQL in the SQL Editor

-- ============================================================
-- profiles table: stores user preferences and premium status
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  is_premium boolean not null default false,
  stripe_customer_id text unique,
  alert_categories text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile (but not is_premium — that's admin only)
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Service role can do everything (for pipeline scripts)
create policy "Service role full access"
  on public.profiles for all
  using (auth.role() = 'service_role');

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger: when a user signs up, create their profile row
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists idx_profiles_is_premium
  on public.profiles (is_premium)
  where is_premium = true;

-- ============================================================
-- saved_ideas table: user bookmarks with private notes
-- ============================================================
create table if not exists public.saved_ideas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  idea_id text not null,
  notes text not null default '',
  saved_at timestamptz not null default now(),
  unique (user_id, idea_id)
);

alter table public.saved_ideas enable row level security;

create policy "Users can read own saved ideas"
  on public.saved_ideas for select
  using (auth.uid() = user_id);

create policy "Users can insert own saved ideas"
  on public.saved_ideas for insert
  with check (auth.uid() = user_id);

create policy "Users can update own saved ideas"
  on public.saved_ideas for update
  using (auth.uid() = user_id);

create policy "Users can delete own saved ideas"
  on public.saved_ideas for delete
  using (auth.uid() = user_id);

create index if not exists idx_saved_ideas_user_id
  on public.saved_ideas (user_id);

-- ============================================================
-- comments table: threaded discussions on ideas
-- ============================================================
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  idea_id text not null,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "Anyone can read comments"
  on public.comments for select
  using (true);

create policy "Authenticated users can create comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

create index if not exists idx_comments_idea_id
  on public.comments (idea_id);

create index if not exists idx_comments_parent_id
  on public.comments (parent_id);

-- ============================================================
-- Auth config (run these in Supabase Dashboard → Authentication → Settings):
--
--   1. Enable Email provider (magic link / OTP)
--   2. Set Site URL to your production URL (e.g., https://ideaoasis.kr)
--   3. Add redirect URLs:
--      - http://localhost:3000/auth/
--      - https://ideaoasis.kr/auth/
--      - https://your-vercel-url.vercel.app/auth/
-- ============================================================
