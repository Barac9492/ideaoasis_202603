"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!user) {
    return (
      <Link
        href="/login/"
        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
      >
        로그인
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-[#2563EB] text-white text-sm font-bold flex items-center justify-center"
      >
        {user.email?.[0]?.toUpperCase() ?? "U"}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg py-1 z-50">
          <p className="px-4 py-2 text-xs text-zinc-400 truncate">
            {user.email}
          </p>
          <Link
            href="/settings/"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            설정
          </Link>
          <button
            onClick={() => {
              supabase.auth.signOut();
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
