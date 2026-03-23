import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      {currentPage > 1 && (
        <Link
          href={`${basePath}/${currentPage - 1}/`}
          className="px-3 py-1.5 text-sm rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          ← 이전
        </Link>
      )}
      <span className="text-sm text-zinc-400 dark:text-zinc-500">
        {currentPage} / {totalPages}
      </span>
      {currentPage < totalPages && (
        <Link
          href={`${basePath}/${currentPage + 1}/`}
          className="px-3 py-1.5 text-sm rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          다음 →
        </Link>
      )}
    </div>
  );
}
