import type { IdeaScore } from "@/lib/schema";

function barColor(score: number) {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}

const dimensions = [
  { key: "market_opportunity" as const, label: "시장 기회", desc: "TAM, 성장률, 경쟁 밀도" },
  { key: "execution_difficulty" as const, label: "실행 용이성", desc: "기술 난이도, 규제, 자본" },
  { key: "timing" as const, label: "타이밍", desc: "한국 시장 준비도" },
];

export function ScoreBreakdown({ score }: { score?: IdeaScore }) {
  if (!score) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          종합 점수
        </h2>
        <div className="flex items-center gap-2">
          <span className={`text-3xl font-bold ${score.overall >= 70 ? "text-emerald-600 dark:text-emerald-400" : score.overall >= 40 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
            {score.overall}
          </span>
          <span className="text-sm text-zinc-400">/100</span>
        </div>
      </div>

      <div className="space-y-4">
        {dimensions.map(({ key, label, desc }) => (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-2">{desc}</span>
              </div>
              <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">{score[key]}</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${barColor(score[key])}`}
                style={{ width: `${score[key]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
