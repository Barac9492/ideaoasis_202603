import type { NaverTrends } from "@/lib/schema";

const arrows = {
  up: { icon: "↑", color: "text-emerald-500" },
  down: { icon: "↓", color: "text-red-500" },
  flat: { icon: "→", color: "text-zinc-400" },
} as const;

export function TrendIndicator({
  trends,
  size = "sm",
}: {
  trends: NaverTrends | null;
  size?: "sm" | "md";
}) {
  if (!trends) {
    return (
      <span className="text-xs text-zinc-400 dark:text-zinc-500">
        트렌드 데이터 없음
      </span>
    );
  }

  const { icon, color } = arrows[trends.trend_direction];

  if (size === "sm") {
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <span className={`font-bold ${color}`}>{icon}</span>
        <span className="text-zinc-600 dark:text-zinc-300 font-medium">
          {trends.trend_index}
        </span>
        <span className="text-zinc-400 dark:text-zinc-500">네이버</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className={`text-2xl font-bold ${color}`}>{icon}</span>
        <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {trends.trend_index}
        </span>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          / 100 네이버 트렌드
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {trends.keywords.map((kw) => (
          <span
            key={kw}
            className="px-2 py-0.5 text-xs rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {kw}
          </span>
        ))}
      </div>
      <p className="text-xs text-zinc-400">
        {trends.period}
        {trends.trend_data && trends.trend_data.length > 0 ? (
          <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
            실제 데이터
          </span>
        ) : (
          <span className="ml-2 px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 font-medium">
            AI 추정
          </span>
        )}
      </p>
    </div>
  );
}
