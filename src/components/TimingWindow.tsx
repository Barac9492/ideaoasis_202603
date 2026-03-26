import type { TimingWindow as TimingWindowType } from "@/lib/schema";

function TimingBadge({ avgMonths }: { avgMonths: number }) {
  if (avgMonths <= 12) {
    return (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
        빠른 진입 가능
      </span>
    );
  }
  if (avgMonths <= 24) {
    return (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
        적정 타이밍
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
      장기 전략 필요
    </span>
  );
}

export function TimingWindow({ timingWindow }: { timingWindow?: TimingWindowType | null }) {
  if (!timingWindow) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          진입 타이밍 분석
        </h2>
        <TimingBadge avgMonths={timingWindow.avg_months} />
      </div>

      <p className="text-zinc-700 dark:text-zinc-300">
        이 카테고리는 평균{" "}
        <span className="font-bold text-[#2563EB]">{timingWindow.avg_months}개월</span>{" "}
        후 한국에 등장합니다
      </p>

      {timingWindow.category_history.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            US → Korea 사례
          </p>
          <div className="space-y-2">
            {timingWindow.category_history.map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm"
              >
                <span className="text-zinc-700 dark:text-zinc-300 min-w-0 flex-1 truncate">
                  {h.us_launch}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-8 h-px bg-zinc-300 dark:bg-zinc-600" />
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                    {h.gap_months}개월
                  </span>
                  <div className="w-8 h-px bg-zinc-300 dark:bg-zinc-600" />
                </div>
                <span className="text-zinc-700 dark:text-zinc-300 min-w-0 flex-1 truncate text-right">
                  {h.kr_equivalent}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
