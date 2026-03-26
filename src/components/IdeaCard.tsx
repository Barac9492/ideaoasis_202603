import Link from "next/link";
import type { Idea } from "@/lib/schema";
import { DifficultyBadge } from "./DifficultyBadge";
import { SourceBadge } from "./SourceBadge";
import { TrendIndicator } from "./TrendIndicator";
import { ScoreBadge } from "./ScoreBadge";
import { BookmarkButton } from "./BookmarkButton";
import { SignalButtons } from "./SignalButtons";

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
      className="group block relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 pl-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-l-[#2563EB]"
    >
      {showRank && (
        <span className="absolute -top-3 -left-1 w-7 h-7 flex items-center justify-center bg-[#2563EB] text-white text-xs font-bold rounded-full shadow-sm">
          {idea.rank}
        </span>
      )}
      <div className="absolute top-3 right-3">
        <BookmarkButton ideaId={idea.id} />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-[#2563EB] transition-colors">
          {idea.title_ko}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-[var(--font-serif)] italic">
          {idea.tagline_en}
        </p>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-2">
          {idea.summary_ko}
        </p>

        <div className="flex items-center gap-3 pt-1">
          <DifficultyBadge difficulty={idea.analysis_ko.difficulty} />
          <SourceBadge source={idea.source} />
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            ▲ {idea.ph_votes}
          </span>
          <TrendIndicator trends={idea.naver_trends} size="sm" />
          <ScoreBadge score={idea.score} />
          {(idea.analysis_ko.competitors_kr_detailed?.length ?? 0) > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              🇰🇷 경쟁사 있음
            </span>
          )}
          <div className="ml-auto">
            <SignalButtons ideaId={idea.id} layout="compact" />
          </div>
        </div>
      </div>
    </Link>
  );
}
