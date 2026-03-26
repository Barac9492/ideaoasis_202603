import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllIdeaIds, getIdeaById } from "@/lib/data";
import { TrendIndicator } from "@/components/TrendIndicator";
import { TrendChart } from "@/components/TrendChart";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { SourceBadge } from "@/components/SourceBadge";
import { KakaoShare } from "@/components/KakaoShare";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { CompetitorTracker } from "@/components/CompetitorTracker";
import { TimingWindow } from "@/components/TimingWindow";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Comments } from "@/components/Comments";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

const SOURCE_LABELS: Record<string, string> = {
  producthunt: "ProductHunt",
  reddit: "Reddit",
  hackernews: "Hacker News",
};

export function generateStaticParams() {
  return getAllIdeaIds().map((id) => ({ id }));
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return params.then(({ id }) => {
    const result = getIdeaById(id);
    if (!result) return { title: "아이디어를 찾을 수 없습니다" };
    const { idea, date } = result;
    const pageUrl = `${SITE_URL}/idea/${idea.id}/`;
    return {
      title: `${idea.title_ko} — IdeaOasis`,
      description: idea.summary_ko,
      openGraph: {
        title: `${idea.title_ko} — IdeaOasis`,
        description: idea.summary_ko,
        url: pageUrl,
        siteName: SITE_NAME,
        locale: "ko_KR",
        type: "article",
        publishedTime: `${date}T07:00:00+09:00`,
      },
      twitter: {
        card: "summary_large_image",
        title: idea.title_ko,
        description: idea.summary_ko,
      },
      alternates: {
        canonical: pageUrl,
      },
    };
  });
}

export default async function IdeaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = getIdeaById(id);
  if (!result) notFound();

  const { idea, date } = result;
  const pageUrl = `${SITE_URL}/idea/${idea.id}/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: idea.title_ko,
    description: idea.summary_ko,
    datePublished: `${date}T07:00:00+09:00`,
    url: pageUrl,
    inLanguage: "ko",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            <span className="w-8 h-8 flex items-center justify-center bg-[#2563EB] text-white text-sm font-bold rounded-full">
              {idea.rank}
            </span>
            <span className="text-sm text-zinc-400">{date}</span>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {idea.title_ko}
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 font-[var(--font-serif)] italic">
            {idea.tagline_en}
          </p>
          <div className="flex items-center gap-3">
            <DifficultyBadge difficulty={idea.analysis_ko.difficulty} />
            <SourceBadge source={idea.source} />
            <span className="text-sm text-zinc-400">▲ {idea.ph_votes}</span>
            <a
              href={idea.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#2563EB] hover:underline"
            >
              {SOURCE_LABELS[idea.source] || idea.source} →
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

        {/* Score Breakdown */}
        <ScoreBreakdown score={idea.score} />

        {/* Timing Window Analysis */}
        <TimingWindow timingWindow={idea.timing_window} />

        {/* Korean Competitor Tracker */}
        {idea.analysis_ko.competitors_kr_detailed && idea.analysis_ko.competitors_kr_detailed.length > 0 && (
          <CompetitorTracker competitors={idea.analysis_ko.competitors_kr_detailed} />
        )}

        {/* Naver Trends */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            네이버 트렌드
          </h2>
          <TrendIndicator trends={idea.naver_trends} size="md" />
          {idea.naver_trends?.trend_data && idea.naver_trends.trend_data.length >= 2 && (
            <div className="pt-2">
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-2">
                12개월 검색량 추이
              </p>
              <TrendChart data={idea.naver_trends.trend_data} />
            </div>
          )}
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

        {/* Share + Bookmark */}
        <div className="flex items-center gap-3">
          <BookmarkButton ideaId={idea.id} />
          <KakaoShare
            title={idea.title_ko}
            description={idea.summary_ko}
            pageUrl={pageUrl}
          />
        </div>

        {/* Discussion */}
        <Comments ideaId={idea.id} />
      </div>
    </main>
  );
}
