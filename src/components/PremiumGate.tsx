"use client";

import { useState, useMemo } from "react";
import type { Idea } from "@/lib/schema";
import { IdeaCard } from "./IdeaCard";

type SortKey = "rank" | "overall" | "market_opportunity" | "timing";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "rank", label: "랭킹" },
  { key: "overall", label: "점수" },
  { key: "market_opportunity", label: "시장기회" },
  { key: "timing", label: "타이밍" },
];

function sortIdeas(ideas: Idea[], sortBy: SortKey): Idea[] {
  if (sortBy === "rank") return [...ideas].sort((a, b) => a.rank - b.rank);
  return [...ideas].sort((a, b) => (b.score?.[sortBy] ?? 0) - (a.score?.[sortBy] ?? 0));
}

export function PremiumGate({ ideas }: { ideas: Idea[] }) {
  const [sortBy, setSortBy] = useState<SortKey>("rank");

  const hasScores = ideas.some((idea) => idea.score);
  const sorted = useMemo(() => sortIdeas(ideas, sortBy), [ideas, sortBy]);

  return (
    <div className="space-y-5">
      {hasScores && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-400 dark:text-zinc-500">정렬:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                sortBy === opt.key
                  ? "bg-[#2563EB] text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {sorted.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} showRank={sortBy === "rank"} />
      ))}
    </div>
  );
}
