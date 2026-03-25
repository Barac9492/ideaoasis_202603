"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function NoteEditor({
  ideaId,
  userId,
  initialNotes,
}: {
  ideaId: string;
  userId: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const save = useCallback(
    async (value: string) => {
      setStatus("saving");
      await supabase
        .from("saved_ideas")
        .update({ notes: value })
        .eq("user_id", userId)
        .eq("idea_id", ideaId);
      setStatus("saved");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setStatus("idle"), 2000);
    },
    [userId, ideaId]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          메모
        </label>
        {status === "saving" && (
          <span className="text-xs text-zinc-400">저장 중...</span>
        )}
        {status === "saved" && (
          <span className="text-xs text-emerald-500">저장됨</span>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={() => {
          if (notes !== initialNotes) save(notes);
        }}
        placeholder="이 아이디어에 대한 메모를 남겨보세요..."
        rows={2}
        className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 resize-none"
      />
    </div>
  );
}
