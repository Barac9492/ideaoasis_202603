import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllIdeasWithDates } from "@/lib/data";
import { ExploreClient } from "@/components/ExploreClient";

export const metadata: Metadata = {
  title: "탐색 — IdeaOasis",
  description: "모든 스타트업 아이디어를 검색하고 필터링하세요. 카테고리, 점수, 난이도, 소스별로 탐색할 수 있습니다.",
};

export default function ExplorePage() {
  const ideas = getAllIdeasWithDates();

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          아이디어 탐색
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {ideas.length}개의 아이디어를 검색하고 필터링하세요
        </p>
      </div>
      <Suspense fallback={<div className="text-sm text-zinc-400">로딩 중...</div>}>
        <ExploreClient ideas={ideas} />
      </Suspense>
    </main>
  );
}
