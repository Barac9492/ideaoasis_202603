"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Profile } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login/");
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        const p = data as Profile;
        setProfile(p);
        setSelectedCategories(p.alert_categories ?? []);
      }
    }
    load();
  }, [router]);

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
    setSaved(false);
  }

  async function save() {
    if (!profile) return;
    setSaving(true);
    await supabase
      .from("profiles")
      .update({ alert_categories: selectedCategories })
      .eq("id", profile.id);
    setSaving(false);
    setSaved(true);
  }

  if (!profile) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-zinc-500">로딩 중...</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        설정
      </h1>

      <div className="space-y-6">
        {/* Account */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            계정
          </h2>
          <p className="text-sm text-zinc-500">{profile.email}</p>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                profile.is_premium
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {profile.is_premium ? "프리미엄" : "무료"}
            </span>
          </div>
        </div>

        {/* Category Alerts */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              카테고리 알림
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              선택한 카테고리의 아이디어가 올라오면 이메일로 알려드립니다
              {!profile.is_premium && " (프리미엄 전용)"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const selected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  disabled={!profile.is_premium}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    selected
                      ? "bg-[#FF6B6B]/10 text-[#FF6B6B] border-2 border-[#FF6B6B]"
                      : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-2 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                  } ${!profile.is_premium ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {profile.is_premium && (
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-[#FF6B6B] text-white text-sm font-medium hover:bg-[#FF5252] transition-colors disabled:opacity-50"
            >
              {saving ? "저장 중..." : saved ? "저장됨!" : "저장"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
