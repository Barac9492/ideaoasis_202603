import { getLatestDigest } from "@/lib/data";
import { PremiumGate } from "@/components/PremiumGate";

export default function Home() {
  const digest = getLatestDigest();

  if (!digest) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          아직 데이터가 없습니다
        </h1>
        <p className="mt-2 text-zinc-500">첫 번째 다이제스트가 곧 생성됩니다.</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-1 mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          오늘의 스타트업 아이디어 TOP {digest.ideas.length}
        </h1>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {digest.date} · 마지막 업데이트{" "}
          {new Date(digest.generated_at).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <PremiumGate ideas={digest.ideas} />
    </main>
  );
}
