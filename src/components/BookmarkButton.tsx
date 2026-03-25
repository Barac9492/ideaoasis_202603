"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export function BookmarkButton({ ideaId }: { ideaId: string }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (!uid) {
        setLoading(false);
        return;
      }
      supabase
        .from("saved_ideas")
        .select("id")
        .eq("user_id", uid)
        .eq("idea_id", ideaId)
        .maybeSingle()
        .then(({ data: row }) => {
          setSaved(!!row);
          setLoading(false);
        });
    });
  }, [ideaId]);

  const toggle = useCallback(async () => {
    if (!userId) {
      window.location.href = "/login/";
      return;
    }
    setLoading(true);
    if (saved) {
      await supabase
        .from("saved_ideas")
        .delete()
        .eq("user_id", userId)
        .eq("idea_id", ideaId);
      setSaved(false);
    } else {
      await supabase
        .from("saved_ideas")
        .insert({ user_id: userId, idea_id: ideaId });
      setSaved(true);
    }
    setLoading(false);
  }, [userId, saved, ideaId]);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      disabled={loading}
      className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
      aria-label={saved ? "저장 취소" : "저장하기"}
      title={saved ? "저장 취소" : "저장하기"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className={`w-5 h-5 ${saved ? "text-[#2563EB]" : "text-zinc-400 dark:text-zinc-500"}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z"
        />
      </svg>
    </button>
  );
}
