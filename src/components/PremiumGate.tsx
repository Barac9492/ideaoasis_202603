"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured, type Profile } from "@/lib/supabase";
import { FREE_IDEAS_LIMIT } from "@/lib/constants";
import type { Idea } from "@/lib/schema";
import { IdeaCard } from "./IdeaCard";
import Link from "next/link";

export function PremiumGate({ ideas }: { ideas: Idea[] }) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("is_premium")
          .eq("id", user.id)
          .single();
        setIsPremium((data as Profile | null)?.is_premium ?? false);
      }
      setLoading(false);
    }
    check();
  }, []);

  const freeIdeas = ideas.slice(0, FREE_IDEAS_LIMIT);
  const premiumIdeas = ideas.slice(FREE_IDEAS_LIMIT);

  return (
    <div className="space-y-5">
      {freeIdeas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}

      {premiumIdeas.length > 0 && !loading && !isPremium && (
        <div className="relative">
          <div className="space-y-5 opacity-40 blur-[2px] pointer-events-none select-none">
            {premiumIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 text-center shadow-lg max-w-sm">
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                +{premiumIdeas.length}개 아이디어 더 보기
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                프리미엄 구독으로 매일 {ideas.length}개 전체 아이디어와 카테고리
                알림을 받아보세요
              </p>
              <Link
                href="/login/"
                className="mt-4 inline-block px-5 py-2.5 rounded-lg bg-[#FF6B6B] text-white text-sm font-medium hover:bg-[#FF5252] transition-colors"
              >
                시작하기
              </Link>
            </div>
          </div>
        </div>
      )}

      {premiumIdeas.length > 0 && isPremium && (
        <>
          {premiumIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </>
      )}
    </div>
  );
}
