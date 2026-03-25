import type { KrCompetitor } from "@/lib/schema";

export function CompetitorTracker({ competitors }: { competitors: KrCompetitor[] }) {
  if (competitors.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
        한국 경쟁사 트래커
      </h2>
      <div className="space-y-3">
        {competitors.map((c) => (
          <div
            key={c.name}
            className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 space-y-2"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-zinc-900 dark:text-zinc-50">{c.name}</span>
              {c.founded_year && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                  {c.founded_year}년 설립
                </span>
              )}
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                {c.funding_status}
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {c.differentiation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
