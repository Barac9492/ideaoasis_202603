import { getAllDigestDates, getDigestsPaginated } from "@/lib/data";
import { DIGESTS_PER_ARCHIVE_PAGE } from "@/lib/constants";
import { Pagination } from "@/components/Pagination";
import { ArchiveClient } from "@/components/ArchiveClient";

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
        <ArchiveClient digests={digests} />
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/archive"
      />
    </main>
  );
}
