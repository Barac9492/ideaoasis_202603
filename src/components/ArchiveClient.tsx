"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import type { Idea } from "@/lib/schema";

type Digest = { date: string; ideas: Idea[] };

export function ArchiveClient({ digests }: { digests: Digest[] }) {
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!category) return digests;
    return digests
      .map((d) => ({
        date: d.date,
        ideas: d.ideas.filter((i) => i.category === category),
      }))
      .filter((d) => d.ideas.length > 0);
  }, [digests, category]);

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap mb-6">
        <button
          onClick={() => setCategory(null)}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            !category
              ? "bg-[#2563EB] text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          전체
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              category === cat.id
                ? "bg-[#2563EB] text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm py-4">
          해당 카테고리의 아이디어가 없습니다.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map(({ date, ideas }) => (
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
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#2563EB] transition-colors inline-flex items-center gap-2"
                    >
                      <span className="text-zinc-400">#{idea.rank}</span>
                      {idea.title_ko}
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                        {CATEGORIES.find((c) => c.id === idea.category)?.emoji ?? ""}{" "}
                        {CATEGORIES.find((c) => c.id === idea.category)?.label ?? idea.category}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
