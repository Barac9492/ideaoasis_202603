import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import type { DailyDigest, Idea } from "@/lib/schema";

let fontRegular: ArrayBuffer | null = null;
let fontBold: ArrayBuffer | null = null;

function loadFonts() {
  if (!fontRegular) {
    const regularPath = path.join(process.cwd(), "public/fonts/Pretendard-Regular.woff2");
    fontRegular = fs.readFileSync(regularPath).buffer as ArrayBuffer;
  }
  if (!fontBold) {
    const boldPath = path.join(process.cwd(), "public/fonts/Pretendard-Bold.woff2");
    fontBold = fs.readFileSync(boldPath).buffer as ArrayBuffer;
  }
  return [
    { name: "Pretendard", data: fontRegular, weight: 400 as const, style: "normal" as const },
    { name: "Pretendard", data: fontBold, weight: 700 as const, style: "normal" as const },
  ];
}

function ideaOGElement(idea: Idea) {
  return {
    type: "div",
    props: {
      style: {
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 80px",
        background: "linear-gradient(135deg, #FAFAF9 0%, #FFF5F5 100%)",
        fontFamily: "Pretendard",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center", gap: 16, marginBottom: 24 },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    width: 40, height: 40, borderRadius: 20,
                    background: "#2563EB", color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 700,
                  },
                  children: String(idea.rank),
                },
              },
              {
                type: "span",
                props: {
                  style: { fontSize: 18, color: "#a1a1aa" },
                  children: "IdeaOasis",
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { fontSize: 48, fontWeight: 700, color: "#18181b", lineHeight: 1.2 },
            children: idea.title_ko,
          },
        },
        {
          type: "div",
          props: {
            style: { fontSize: 24, color: "#71717a", marginTop: 16 },
            children: idea.tagline_en,
          },
        },
        {
          type: "div",
          props: {
            style: { fontSize: 18, color: "#a1a1aa", marginTop: "auto" },
            children: `▲ ${idea.ph_votes} · ${idea.analysis_ko.difficulty}`,
          },
        },
      ],
    },
  };
}

function dailyOGElement(date: string) {
  return {
    type: "div",
    props: {
      style: {
        width: 1200, height: 630,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
        fontFamily: "Pretendard", color: "white",
      },
      children: [
        { type: "div", props: { style: { fontSize: 28, opacity: 0.9 }, children: "IdeaOasis" } },
        { type: "div", props: { style: { fontSize: 52, fontWeight: 700, marginTop: 16 }, children: "오늘의 스타트업 아이디어 TOP 5" } },
        { type: "div", props: { style: { fontSize: 24, opacity: 0.8, marginTop: 12 }, children: date } },
      ],
    },
  };
}

async function renderOG(element: unknown): Promise<Buffer> {
  const fonts = loadFonts();
  const svg = await satori(element as React.ReactNode, {
    width: 1200,
    height: 630,
    fonts,
  });
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  return Buffer.from(resvg.render().asPng());
}

export async function generateOGImages(
  digest: DailyDigest
): Promise<Map<string, string>> {
  const ogDir = path.join(process.cwd(), "public", "og");
  fs.mkdirSync(ogDir, { recursive: true });
  const urls = new Map<string, string>();

  // Generate per-idea OG images
  for (const idea of digest.ideas) {
    try {
      const png = await renderOG(ideaOGElement(idea));
      fs.writeFileSync(path.join(ogDir, `${idea.id}.png`), png);
      urls.set(idea.id, `/og/${idea.id}.png`);
    } catch (err) {
      console.warn(`Failed to generate OG for ${idea.id}:`, err);
    }
  }

  // Generate daily OG image
  try {
    const dailyPng = await renderOG(dailyOGElement(digest.date));
    fs.writeFileSync(path.join(ogDir, `daily-${digest.date}.png`), dailyPng);
    urls.set("daily", `/og/daily-${digest.date}.png`);
  } catch (err) {
    console.warn("Failed to generate daily OG:", err);
  }

  return urls;
}
