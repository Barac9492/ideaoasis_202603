"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import Link from "next/link";

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY ?? "";
const YEARLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY ?? "";

const features = {
  free: [
    "매일 5개 아이디어",
    "한국 시장 분석",
    "네이버 트렌드 데이터",
    "아카이브 열람",
  ],
  premium: [
    "매일 10개 전체 아이디어",
    "한국 시장 분석",
    "네이버 트렌드 데이터",
    "아카이브 열람",
    "카테고리 이메일 알림",
    "주간 딥다이브 리포트",
    "우선 지원",
  ],
};

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (!isSupabaseConfigured) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/login/?redirect=/pricing/";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          priceId: billing === "monthly" ? MONTHLY_PRICE_ID : YEARLY_PRICE_ID,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          프리미엄 구독
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          매일 아침, 더 많은 아이디어와 깊은 분석을 받아보세요
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              billing === "monthly"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            월간
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              billing === "yearly"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            연간
            <span className="ml-1 text-xs text-[#16A34A]">2개월 무료</span>
          </button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Free tier */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            무료
          </h2>
          <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            ₩0
            <span className="text-sm font-normal text-zinc-500">/월</span>
          </p>
          <ul className="mt-5 space-y-3">
            {features.free.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
              >
                <span className="text-zinc-400 mt-0.5">&#10003;</span>
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/login/"
            className="mt-6 block w-full text-center px-5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            시작하기
          </Link>
        </div>

        {/* Premium tier */}
        <div className="rounded-2xl border-2 border-[#2563EB] bg-white dark:bg-zinc-900 p-6 relative">
          <span className="absolute -top-3 left-5 px-3 py-0.5 text-xs font-bold bg-[#2563EB] text-white rounded-full">
            추천
          </span>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            프리미엄
          </h2>
          <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {billing === "monthly" ? "₩9,900" : "₩99,000"}
            <span className="text-sm font-normal text-zinc-500">
              /{billing === "monthly" ? "월" : "년"}
            </span>
          </p>
          {billing === "yearly" && (
            <p className="text-xs text-[#16A34A] mt-1">
              월 ₩8,250 — 2개월 무료
            </p>
          )}
          <ul className="mt-5 space-y-3">
            {features.premium.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
              >
                <span className="text-[#2563EB] mt-0.5">&#10003;</span>
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-6 block w-full text-center px-5 py-2.5 rounded-lg bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
          >
            {loading ? "처리 중..." : "7일 무료 체험 시작"}
          </button>
          <p className="mt-2 text-xs text-center text-zinc-400">
            7일 무료 체험 후 자동 결제
          </p>
        </div>
      </div>
    </main>
  );
}
