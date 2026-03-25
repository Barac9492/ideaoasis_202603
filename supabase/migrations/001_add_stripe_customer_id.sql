-- Add stripe_customer_id to profiles table for Stripe integration
-- Run this in Supabase SQL Editor if you already have the profiles table

alter table public.profiles
  add column if not exists stripe_customer_id text unique;

create index if not exists idx_profiles_stripe_customer_id
  on public.profiles (stripe_customer_id)
  where stripe_customer_id is not null;
