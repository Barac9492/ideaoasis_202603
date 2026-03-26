"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function HammerIcon({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`w-3.5 h-3.5 ${active ? "text-[#2563EB]" : "text-zinc-400 dark:text-zinc-500"}`}
    >
      <path
        fillRule="evenodd"
        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.5}
      className={`w-3.5 h-3.5 ${active ? "text-[#2563EB]" : "text-zinc-400 dark:text-zinc-500"}`}
    >
      <path
        fillRule="evenodd"
        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function SignalButtons({
  ideaId,
  layout = "compact",
}: {
  ideaId: string;
  layout?: "compact" | "full";
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [myBuilding, setMyBuilding] = useState(false);
  const [myInterested, setMyInterested] = useState(false);
  const [buildingCount, setBuildingCount] = useState(0);
  const [interestedCount, setInterestedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    async function init() {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id ?? null;
      setUserId(uid);

      const { data: signals } = await supabase
        .from("idea_signals")
        .select("signal_type, user_id")
        .eq("idea_id", ideaId);

      if (signals) {
        setBuildingCount(signals.filter((s) => s.signal_type === "building").length);
        setInterestedCount(signals.filter((s) => s.signal_type === "interested").length);
        if (uid) {
          setMyBuilding(signals.some((s) => s.user_id === uid && s.signal_type === "building"));
          setMyInterested(signals.some((s) => s.user_id === uid && s.signal_type === "interested"));
        }
      }
      setLoading(false);
    }

    init();
  }, [ideaId]);

  const toggle = useCallback(
    async (type: "building" | "interested") => {
      if (!userId) {
        window.location.href = "/login/";
        return;
      }

      const isActive = type === "building" ? myBuilding : myInterested;

      // Optimistic update
      if (type === "building") {
        setMyBuilding(!isActive);
        setBuildingCount((c) => c + (isActive ? -1 : 1));
      } else {
        setMyInterested(!isActive);
        setInterestedCount((c) => c + (isActive ? -1 : 1));
      }

      if (isActive) {
        await supabase
          .from("idea_signals")
          .delete()
          .eq("user_id", userId)
          .eq("idea_id", ideaId)
          .eq("signal_type", type);
      } else {
        await supabase
          .from("idea_signals")
          .insert({ user_id: userId, idea_id: ideaId, signal_type: type });
      }
    },
    [userId, myBuilding, myInterested, ideaId]
  );

  if (loading) {
    if (layout === "compact") return null;
    return <div className="h-10" />;
  }

  if (layout === "compact") {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle("building");
          }}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
            myBuilding
              ? "bg-[#2563EB]/10 text-[#2563EB]"
              : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400"
          }`}
          title="나도 만들 거예요"
        >
          <HammerIcon active={myBuilding} />
          <span className="transition-all">{buildingCount || ""}</span>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle("interested");
          }}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
            myInterested
              ? "bg-[#2563EB]/10 text-[#2563EB]"
              : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400"
          }`}
          title="이거 쓸래요"
        >
          <HeartIcon active={myInterested} />
          <span className="transition-all">{interestedCount || ""}</span>
        </button>
      </div>
    );
  }

  // Full layout for detail page
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => toggle("building")}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
          myBuilding
            ? "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30"
            : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-[#2563EB]/30 hover:text-[#2563EB]"
        }`}
      >
        <HammerIcon active={myBuilding} />
        <span>나도 만들 거예요</span>
        {buildingCount > 0 && (
          <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
            myBuilding
              ? "bg-[#2563EB]/20"
              : "bg-zinc-200 dark:bg-zinc-700"
          }`}>
            {buildingCount}
          </span>
        )}
      </button>
      <button
        onClick={() => toggle("interested")}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
          myInterested
            ? "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30"
            : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-[#2563EB]/30 hover:text-[#2563EB]"
        }`}
      >
        <HeartIcon active={myInterested} />
        <span>이거 쓸래요</span>
        {interestedCount > 0 && (
          <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
            myInterested
              ? "bg-[#2563EB]/20"
              : "bg-zinc-200 dark:bg-zinc-700"
          }`}>
            {interestedCount}
          </span>
        )}
      </button>
    </div>
  );
}
