export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        About IdeaOasis
      </h1>

      <div className="space-y-6">
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            IdeaOasis란?
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            IdeaOasis는 매일 아침 전 세계에서 주목받는 스타트업 아이디어를
            큐레이션하고, AI가 한국 시장 관점에서 분석하여 한국 창업자들에게
            전달하는 서비스입니다.
          </p>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            데이터 소스
          </h2>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>ProductHunt</strong> — 매일 가장 주목받는 신규 제품과
              서비스
            </li>
            <li>
              <strong>Claude AI</strong> — 아이디어 큐레이션 및 한국 시장
              분석
            </li>
            <li>
              <strong>네이버 데이터랩</strong> — 한국 소비자 검색 트렌드
              데이터
            </li>
          </ul>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            매일 업데이트
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            매일 아침 5시(KST)에 자동으로 새로운 아이디어가 업데이트됩니다.
            매주 토요일에는 한 주의 가장 유망한 아이디어에 대한 심층 분석이
            추가됩니다.
          </p>
        </section>
      </div>
    </main>
  );
}
