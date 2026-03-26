"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Idea } from "@/lib/schema";
import { CATEGORIES } from "@/lib/categories";
import { IdeaCard } from "./IdeaCard";

type SortKey = "date" | "overall" | "market" | "timing" | "votes";
type ScorePreset = "all" | "40" | "70";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "date", label: "최신순" },
  { key: "overall", label: "종합점수" },
  { key: "market", label: "시장기회" },
  { key: "timing", label: "타이밍" },
  { key: "votes", label: "투표수" },
];

const DIFFICULTY_OPTIONS = [
  { value: "Easy", label: "쉬움" },
  { value: "Medium", label: "보통" },
  { value: "Hard", label: "어려움" },
];

const SOURCE_OPTIONS = [
  { value: "producthunt", label: "ProductHunt" },
  { value: "reddit", label: "Reddit" },
  { value: "hackernews", label: "HN" },
];

const TREND_OPTIONS = [
  { value: "up", label: "상승" },
  { value: "down", label: "하락" },
  { value: "flat", label: "보합" },
];

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-400">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
      <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
    </svg>
  );
}

function setFromParam(param: string | null): Set<string> {
  if (!param) return new Set();
  return new Set(param.split(",").filter(Boolean));
}

function setToParam(set: Set<string>): string | null {
  if (set.size === 0) return null;
  return Array.from(set).join(",");
}

export function ExploreClient({
  ideas,
}: {
  ideas: { idea: Idea; date: string }[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read initial state from URL
  const [searchText, setSearchText] = useState(searchParams.get("q") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [categories, setCategories] = useState<Set<string>>(() => setFromParam(searchParams.get("cat")));
  const [scorePreset, setScorePreset] = useState<ScorePreset>((searchParams.get("score") as ScorePreset) ?? "all");
  const [difficulties, setDifficulties] = useState<Set<string>>(() => setFromParam(searchParams.get("diff")));
  const [sources, setSources] = useState<Set<string>>(() => setFromParam(searchParams.get("src")));
  const [trends, setTrends] = useState<Set<string>>(() => setFromParam(searchParams.get("trend")));
  const [sortBy, setSortBy] = useState<SortKey>((searchParams.get("sort") as SortKey) ?? "date");
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchText), 200);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Sync state to URL
  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (categories.size) params.set("cat", setToParam(categories)!);
    if (scorePreset !== "all") params.set("score", scorePreset);
    if (difficulties.size) params.set("diff", setToParam(difficulties)!);
    if (sources.size) params.set("src", setToParam(sources)!);
    if (trends.size) params.set("trend", setToParam(trends)!);
    if (sortBy !== "date") params.set("sort", sortBy);

    const qs = params.toString();
    router.replace(pathname + (qs ? `?${qs}` : ""), { scroll: false });
  }, [debouncedSearch, categories, scorePreset, difficulties, sources, trends, sortBy, pathname, router]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  // Toggle helpers
  const toggleSet = (set: Set<string>, value: string): Set<string> => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  // Active filter count
  const activeFilterCount =
    categories.size +
    (scorePreset !== "all" ? 1 : 0) +
    difficulties.size +
    sources.size +
    trends.size;

  // Filter + sort
  const results = useMemo(() => {
    let filtered = ideas;

    // Text search
    if (debouncedSearch.trim()) {
      const terms = debouncedSearch.toLowerCase().split(/\s+/).filter(Boolean);
      filtered = filtered.filter(({ idea }) => {
        const haystack = [
          idea.title_ko,
          idea.title_en,
          idea.tagline_en,
          idea.summary_ko,
          idea.analysis_ko.description,
        ]
          .join(" ")
          .toLowerCase();
        return terms.every((term) => haystack.includes(term));
      });
    }

    // Category
    if (categories.size > 0) {
      filtered = filtered.filter(({ idea }) => categories.has(idea.category));
    }

    // Score
    if (scorePreset !== "all") {
      const min = parseInt(scorePreset);
      filtered = filtered.filter(({ idea }) => (idea.score?.overall ?? 0) >= min);
    }

    // Difficulty
    if (difficulties.size > 0) {
      filtered = filtered.filter(({ idea }) => difficulties.has(idea.analysis_ko.difficulty));
    }

    // Source
    if (sources.size > 0) {
      filtered = filtered.filter(({ idea }) => sources.has(idea.source));
    }

    // Trend
    if (trends.size > 0) {
      filtered = filtered.filter(
        ({ idea }) => idea.naver_trends && trends.has(idea.naver_trends.trend_direction)
      );
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case "overall":
        sorted.sort((a, b) => (b.idea.score?.overall ?? 0) - (a.idea.score?.overall ?? 0));
        break;
      case "market":
        sorted.sort((a, b) => (b.idea.score?.market_opportunity ?? 0) - (a.idea.score?.market_opportunity ?? 0));
        break;
      case "timing":
        sorted.sort((a, b) => (b.idea.score?.timing ?? 0) - (a.idea.score?.timing ?? 0));
        break;
      case "votes":
        sorted.sort((a, b) => b.idea.ph_votes - a.idea.ph_votes);
        break;
      case "date":
      default:
        // Already sorted newest-first from data layer
        break;
    }

    return sorted;
  }, [ideas, debouncedSearch, categories, scorePreset, difficulties, sources, trends, sortBy]);

  // Clear all filters
  const clearAll = () => {
    setSearchText("");
    setCategories(new Set());
    setScorePreset("all");
    setDifficulties(new Set());
    setSources(new Set());
    setTrends(new Set());
    setSortBy("date");
  };

  // Active filter pills data
  const pills: { label: string; onRemove: () => void }[] = [];
  categories.forEach((cat) => {
    const c = CATEGORIES.find((c) => c.id === cat);
    if (c) pills.push({ label: `${c.emoji} ${c.label}`, onRemove: () => setCategories((s) => { const n = new Set(s); n.delete(cat); return n; }) });
  });
  if (scorePreset !== "all") {
    pills.push({ label: `${scorePreset}점 이상`, onRemove: () => setScorePreset("all") });
  }
  difficulties.forEach((d) => {
    const opt = DIFFICULTY_OPTIONS.find((o) => o.value === d);
    if (opt) pills.push({ label: opt.label, onRemove: () => setDifficulties((s) => { const n = new Set(s); n.delete(d); return n; }) });
  });
  sources.forEach((s) => {
    const opt = SOURCE_OPTIONS.find((o) => o.value === s);
    if (opt) pills.push({ label: opt.label, onRemove: () => setSources((set) => { const n = new Set(set); n.delete(s); return n; }) });
  });
  trends.forEach((t) => {
    const opt = TREND_OPTIONS.find((o) => o.value === t);
    if (opt) pills.push({ label: opt.label, onRemove: () => setTrends((s) => { const n = new Set(s); n.delete(t); return n; }) });
  });

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="아이디어 검색... (한국어, 영어 모두 가능)"
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB]/50 transition-all"
        />
        {searchText && (
          <button
            onClick={() => setSearchText("")}
            className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-600"
          >
            <XIcon />
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {pills.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          {pills.map((pill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-[#2563EB]/10 text-[#2563EB]"
            >
              {pill.label}
              <button onClick={pill.onRemove} className="hover:bg-[#2563EB]/20 rounded-full p-0.5 transition-colors">
                <XIcon />
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            모두 지우기
          </button>
        </div>
      )}

      {/* Filter panel */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <FilterIcon />
            필터
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#2563EB] text-white">
                {activeFilterCount}
              </span>
            )}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-4 h-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        {filtersOpen && (
          <div className="px-5 pb-5 space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-4">
            {/* Categories */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">카테고리</label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategories((s) => toggleSet(s, cat.id))}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      categories.has(cat.id)
                        ? "bg-[#2563EB] text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Score preset */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">종합점수</label>
              <div className="flex gap-1.5">
                {([["all", "모두"], ["40", "40점 이상"], ["70", "70점 이상"]] as [ScorePreset, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setScorePreset(key)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      scorePreset === key
                        ? "bg-[#2563EB] text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty + Source + Trend in a row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">난이도</label>
                <div className="flex gap-1.5">
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDifficulties((s) => toggleSet(s, opt.value))}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        difficulties.has(opt.value)
                          ? "bg-[#2563EB] text-white"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">소스</label>
                <div className="flex gap-1.5">
                  {SOURCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSources((s) => toggleSet(s, opt.value))}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        sources.has(opt.value)
                          ? "bg-[#2563EB] text-white"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">트렌드</label>
                <div className="flex gap-1.5">
                  {TREND_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTrends((s) => toggleSet(s, opt.value))}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                        trends.has(opt.value)
                          ? "bg-[#2563EB] text-white"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sort + count bar */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">{results.length}</span>개의 아이디어
        </span>
        <div className="flex items-center gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors ${
                sortBy === opt.key
                  ? "bg-[#2563EB] text-white"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <SearchIcon />
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
            검색 조건에 맞는 아이디어가 없습니다
          </p>
          <button
            onClick={clearAll}
            className="text-xs text-[#2563EB] hover:underline"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map(({ idea, date }) => (
            <div key={idea.id} className="relative">
              <span className="absolute -top-2 right-3 px-2 py-0.5 text-[10px] font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-950 rounded z-10">
                {date}
              </span>
              <IdeaCard idea={idea} showRank={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
