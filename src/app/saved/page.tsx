import type { Metadata } from "next";
import { getAllIdeasMap } from "@/lib/data";
import { SavedIdeasClient } from "@/components/SavedIdeasClient";

export const metadata: Metadata = {
  title: "저장한 아이디어 — IdeaOasis",
  description: "내가 저장한 스타트업 아이디어 모음",
};

export default function SavedPage() {
  const ideasMap = getAllIdeasMap();

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        저장한 아이디어
      </h1>
      <SavedIdeasClient ideasJson={JSON.stringify(ideasMap)} />
    </main>
  );
}
