import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "IdeaOasis - 오늘의 스타트업 아이디어",
  description:
    "매일 아침, 실리콘밸리에서 온 스타트업 아이디어 5선. 한국 시장 분석과 네이버 트렌드 데이터까지.",
  alternates: {
    types: {
      "application/atom+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
          <Header />
          {children}
          <Footer />
        </body>
    </html>
  );
}
