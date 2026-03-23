import Link from "next/link";
import { getAllDigestDates, getDigestsPaginated } from "@/lib/data";
import { DIGESTS_PER_ARCHIVE_PAGE } from "@/lib/constants";
import { Pagination } from "@/components/Pagination";

export function generateStaticParams() {
  const total = getAllDigestDates().length;
  const pages = Math.max(1, Math.ceil(total / DIGESTS_PER_ARCHIVE_PAGE));
  return Array.from({ length: pages }, (_, i) => ({ page: String(i + 1) }));
}

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: pageStr } = await params;
  const page = parseInt(pageStr, 10) || 1;
  const { digests, totalPages } = getDigestsPaginated(page);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        아카이브
      </h1>

      {digests.length === 0 ? (
        <p className="text-zinc-500">아직 다이제스트가 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {digests.map(({ date, ideas }) => (
            <div
              key={date}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 space-y-3"
            >
              <h2 className="font-bold text-zinc-900 dark:text-zinc-50">
                {date}
              </h2>
              <ul className="space-y-1.5">
                {ideas.map((idea) => (
                  <li key={idea.id}>
                    <Link
                      href={`/idea/${idea.id}/`}
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#FF6B6B] transition-colors"
                    >
                      <span className="text-zinc-400 mr-2">#{idea.rank}</span>
                      {idea.title_ko}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/archive"
      />
    </main>
  );
}
