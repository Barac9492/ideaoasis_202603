import Link from "next/link";
import type { Idea } from "@/lib/schema";
import { DifficultyBadge } from "./DifficultyBadge";
import { TrendIndicator } from "./TrendIndicator";

export function IdeaCard({
  idea,
  showRank = true,
}: {
  idea: Idea;
  showRank?: boolean;
}) {
  return (
    <Link
      href={`/idea/${idea.id}/`}
      className="group block relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 pl-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-l-[#FF6B6B]"
    >
      {showRank && (
        <span className="absolute -top-3 -left-1 w-7 h-7 flex items-center justify-center bg-[#FF6B6B] text-white text-xs font-bold rounded-full shadow-sm">
          {idea.rank}
        </span>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-[#FF6B6B] transition-colors">
          {idea.title_ko}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {idea.tagline_en}
        </p>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-2">
          {idea.summary_ko}
        </p>

        <div className="flex items-center gap-3 pt-1">
          <DifficultyBadge difficulty={idea.analysis_ko.difficulty} />
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            ▲ {idea.ph_votes}
          </span>
          <TrendIndicator trends={idea.naver_trends} size="sm" />
        </div>
      </div>
    </Link>
  );
}
