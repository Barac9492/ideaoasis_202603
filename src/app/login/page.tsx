"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { SITE_URL } from "@/lib/constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${SITE_URL}/auth/` },
    });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <main className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 text-center mb-8">
        Idea<span className="text-[#2563EB]">Oasis</span> 로그인
      </h1>

      {sent ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 text-center">
          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            이메일을 확인하세요
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {email}로 로그인 링크를 보냈습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
            이메일 주소를 입력하면 로그인 링크를 보내드립니다.
          </p>

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              required
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-xl bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1D4ED8] transition-colors"
            >
              이메일로 로그인
            </button>
          </form>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </div>
      )}
    </main>
  );
}
