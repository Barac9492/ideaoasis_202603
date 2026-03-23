import fs from "node:fs";
import path from "node:path";
import { DailyDigestSchema, type DailyDigest } from "@/lib/schema";
import { fetchTopProducts } from "./fetch-ph";
import { analyzeProducts } from "./analyze";
import { fetchNaverTrends } from "./naver-trends";

async function main() {
  const today = new Date().toISOString().split("T")[0];
  console.log(`[IdeaOasis] Starting daily pipeline for ${today}`);

  // Step 1: Fetch from ProductHunt
  console.log("[1/4] Fetching ProductHunt posts...");
  const posts = await fetchTopProducts(today);
  if (posts.length === 0) {
    console.error("No posts fetched from ProductHunt. Skipping today.");
    process.exit(1);
  }
  console.log(`  Found ${posts.length} posts`);

  // Step 2: Analyze with Claude
  console.log("[2/4] Analyzing with Claude AI...");
  const { ideas, naverKeywords } = await analyzeProducts(posts);
  console.log(`  ${ideas.length} ideas curated`);

  // Step 3: Fetch Naver Trends (non-blocking)
  console.log("[3/4] Fetching Naver trends...");
  const trends = await fetchNaverTrends(naverKeywords);
  for (const idea of ideas) {
    const trend = trends.get(idea.id);
    if (trend) {
      idea.naver_trends = trend;
    }
  }
  const withTrends = ideas.filter((i) => i.naver_trends !== null).length;
  console.log(`  ${withTrends}/${ideas.length} ideas have trend data`);

  // Step 4: Validate and write
  console.log("[4/4] Validating and writing digest...");
  const digest: DailyDigest = {
    date: today,
    ideas,
    generated_at: new Date().toISOString(),
  };

  const validated = DailyDigestSchema.parse(digest);

  const outDir = path.join(process.cwd(), "data", "digests");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${today}.json`);
  fs.writeFileSync(outPath, JSON.stringify(validated, null, 2));

  console.log(`[IdeaOasis] Done! Wrote ${outPath}`);
}

main().catch((err) => {
  console.error("[IdeaOasis] Pipeline failed:", err);
  process.exit(1);
});
