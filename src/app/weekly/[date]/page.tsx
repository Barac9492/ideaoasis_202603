import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllWeeklyDates, getWeeklyByDate } from "@/lib/data";
import { IdeaCard } from "@/components/IdeaCard";

export function generateStaticParams() {
  return getAllWeeklyDates().map((date) => ({ date }));
}

export default async function WeeklyPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const weekly = getWeeklyByDate(date);
  if (!weekly) notFound();

  const { selected_idea, deep_dive_ko } = weekly;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 mb-6 transition-colors"
      >
        ← 돌아가기
      </Link>

      <div className="mb-6">
        <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 mb-3">
          주간 TOP
        </span>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          한 주의 TOP — {weekly.week}
        </h1>
      </div>

      <div className="space-y-6">
        <IdeaCard idea={selected_idea} showRank={false} />

        {/* Market Sizing */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            시장 규모 분석
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {deep_dive_ko.market_sizing}
          </p>
        </div>

        {/* Localization Playbook */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            현지화 플레이북
          </h2>
          <ol className="space-y-2">
            {deep_dive_ko.localization_playbook.map((step, i) => (
              <li
                key={i}
                className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed"
              >
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Comparable Successes */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            한국 유사 성공 사례
          </h2>
          <ul className="space-y-2">
            {deep_dive_ko.comparable_kr_successes.map((s, i) => (
              <li
                key={i}
                className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Build Timeline */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-2">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            예상 개발 타임라인
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300">
            {deep_dive_ko.estimated_build_timeline}
          </p>
        </div>
      </div>
    </main>
  );
}
