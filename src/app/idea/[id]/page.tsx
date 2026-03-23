import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllIdeaIds, getIdeaById } from "@/lib/data";
import { TrendIndicator } from "@/components/TrendIndicator";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { KakaoShare } from "@/components/KakaoShare";
import { SITE_URL } from "@/lib/constants";

export function generateStaticParams() {
  return getAllIdeaIds().map((id) => ({ id }));
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  // Note: generateMetadata in static export mode works synchronously with the data
  // but Next.js types require Promise params in app router
  return params.then(({ id }) => {
    const result = getIdeaById(id);
    if (!result) return { title: "아이디어를 찾을 수 없습니다" };
    return {
      title: `${result.idea.title_ko} — IdeaOasis`,
      description: result.idea.summary_ko,
    };
  });
}

export default async function IdeaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = getIdeaById(id);
  if (!result) notFound();

  const { idea, date } = result;
  const pageUrl = `${SITE_URL}/idea/${idea.id}/`;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 mb-6 transition-colors"
      >
        ← 돌아가기
      </Link>

      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 flex items-center justify-center bg-[#FF6B6B] text-white text-sm font-bold rounded-full">
              {idea.rank}
            </span>
            <span className="text-sm text-zinc-400">{date}</span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {idea.title_ko}
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            {idea.tagline_en}
          </p>
          <div className="flex items-center gap-3">
            <DifficultyBadge difficulty={idea.analysis_ko.difficulty} />
            <span className="text-sm text-zinc-400">▲ {idea.ph_votes}</span>
            <a
              href={idea.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#FF6B6B] hover:underline"
            >
              ProductHunt →
            </a>
          </div>
        </div>

        {/* Korean Summary */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            아이디어 설명
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {idea.analysis_ko.description}
          </p>
        </div>

        {/* Market Fit */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            🇰🇷 한국 시장 적합성
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {idea.analysis_ko.market_fit}
          </p>
          {idea.analysis_ko.competitors_kr.length > 0 && (
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                기존 한국 경쟁사
              </p>
              <div className="flex flex-wrap gap-2">
                {idea.analysis_ko.competitors_kr.map((c) => (
                  <span
                    key={c}
                    className="px-2.5 py-1 text-sm rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Naver Trends */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            네이버 트렌드
          </h2>
          <TrendIndicator trends={idea.naver_trends} size="md" />
        </div>

        {/* Regulatory + Localization */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              규제 고려사항
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {idea.analysis_ko.regulatory_notes}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              현지화 전략
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {idea.analysis_ko.localization_strategy}
            </p>
          </div>
        </div>

        {/* Share */}
        <div className="flex gap-3">
          <KakaoShare
            title={idea.title_ko}
            description={idea.summary_ko}
            pageUrl={pageUrl}
          />
        </div>
      </div>
    </main>
  );
}
