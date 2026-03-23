"use client";

import { useCallback, useState } from "react";

interface KakaoShareProps {
  title: string;
  description: string;
  pageUrl: string;
}

export function KakaoShare({ title, description, pageUrl }: KakaoShareProps) {
  const [copied, setCopied] = useState(false);

  const share = useCallback(() => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    const w = window as unknown as Record<string, unknown>;

    if (kakaoKey && w.Kakao) {
      const Kakao = w.Kakao as {
        isInitialized: () => boolean;
        init: (key: string) => void;
        Share: {
          sendDefault: (params: Record<string, unknown>) => void;
        };
      };
      if (!Kakao.isInitialized()) Kakao.init(kakaoKey);
      Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title,
          description,
          imageUrl: "",
          link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
        },
        buttonTitle: "자세히 보기",
      });
      return;
    }

    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [title, description, pageUrl]);

  return (
    <button
      onClick={share}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FEE500] text-[#191919] text-sm font-medium hover:bg-[#FDD835] transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#191919">
        <path d="M12 3C6.48 3 2 6.36 2 10.5c0 2.67 1.77 5.02 4.44 6.38l-1.13 4.12 4.79-3.15c.6.1 1.24.15 1.9.15 5.52 0 10-3.36 10-7.5S17.52 3 12 3z" />
      </svg>
      {copied ? "링크 복사됨!" : "카카오톡 공유"}
    </button>
  );
}
