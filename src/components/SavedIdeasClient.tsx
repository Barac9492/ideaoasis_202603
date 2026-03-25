"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured, type SavedIdea } from "@/lib/supabase";
import type { Idea } from "@/lib/schema";
import { NoteEditor } from "./NoteEditor";

export function SavedIdeasClient({ ideasJson }: { ideasJson: string }) {
  const ideasMap: Record<string, Idea> = JSON.parse(ideasJson);
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
        .select("*")
        .eq("user_id", uid)
        .order("saved_at", { ascending: false })
        .then(({ data: rows }) => {
          setSavedIdeas((rows as SavedIdea[]) ?? []);
          setLoading(false);
        });
    });
  }, []);

  const handleRemove = async (ideaId: string) => {
    if (!userId) return;
    await supabase
      .from("saved_ideas")
      .delete()
      .eq("user_id", userId)
      .eq("idea_id", ideaId);
    setSavedIdeas((prev) => prev.filter((s) => s.idea_id !== ideaId));
  };

  if (loading) {
    return (
      <p className="text-sm text-zinc-400 dark:text-zinc-500 py-8 text-center">
        불러오는 중...
      </p>
    );
  }

  if (!userId) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-zinc-500 dark:text-zinc-400">
          로그인하면 아이디어를 저장할 수 있습니다.
        </p>
        <Link
          href="/login/"
          className="inline-block px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-lg hover:bg-blue-700 transition-colors"
        >
          로그인
        </Link>
      </div>
    );
  }

  if (savedIdeas.length === 0) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-zinc-500 dark:text-zinc-400">
          아직 저장한 아이디어가 없습니다.
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          홈에서 마음에 드는 아이디어를 저장해보세요!
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-lg hover:bg-blue-700 transition-colors"
        >
          홈으로
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400 dark:text-zinc-500">
        {savedIdeas.length}개의 아이디어를 저장했습니다
      </p>
      {savedIdeas.map((saved) => {
        const idea = ideasMap[saved.idea_id];
        if (!idea) return null;
        return (
          <div
            key={saved.idea_id}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 border-l-4 border-l-[#2563EB] space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/idea/${idea.id}/`}
                className="flex-1 group"
              >
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-[#2563EB] transition-colors">
                  {idea.title_ko}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-[var(--font-serif)] italic mt-1">
                  {idea.tagline_en}
                </p>
              </Link>
              <button
                onClick={() => handleRemove(saved.idea_id)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-colors shrink-0"
                title="저장 취소"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-2">
              {idea.summary_ko}
            </p>
            <NoteEditor
              ideaId={saved.idea_id}
              userId={userId}
              initialNotes={saved.notes}
            />
          </div>
        );
      })}
    </div>
  );
}
