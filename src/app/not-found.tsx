import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-zinc-200 dark:text-zinc-700">
        404
      </h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        페이지를 찾을 수 없습니다
      </p>
      <Link
        href="/"
        className="mt-6 inline-block px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1D4ED8] transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
