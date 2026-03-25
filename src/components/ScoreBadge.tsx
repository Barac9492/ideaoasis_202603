import type { IdeaScore } from "@/lib/schema";

function scoreColor(score: number) {
  if (score >= 70) return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  if (score >= 40) return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
}

export function ScoreBadge({ score }: { score?: IdeaScore }) {
  if (!score) return null;
  return (
    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${scoreColor(score.overall)}`}>
      {score.overall}점
    </span>
  );
}
