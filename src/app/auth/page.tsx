"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <main className="max-w-sm mx-auto px-4 py-16 text-center">
      <p className="text-zinc-500">로그인 처리 중...</p>
    </main>
  );
}
