import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-100 dark:border-zinc-800 mt-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-400 dark:text-zinc-500">
          <p>매일 아침 5시 업데이트</p>
          <div className="flex items-center gap-4">
            <Link
              href="/feed.xml"
              className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              RSS
            </Link>
            <span>&copy; {new Date().getFullYear()} IdeaOasis</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
