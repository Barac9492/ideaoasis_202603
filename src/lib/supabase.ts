"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Create a no-op client if env vars are missing (happens during static build)
export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (new Proxy({} as SupabaseClient, {
        get: () => () => ({ data: null, error: null }),
      }) as unknown as SupabaseClient);

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  is_premium: boolean;
  alert_categories: string[];
  created_at: string;
}

export interface SavedIdea {
  id: string;
  user_id: string;
  idea_id: string;
  notes: string;
  saved_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  idea_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
}
