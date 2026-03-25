import fs from "node:fs";
import path from "node:path";
import { DailyDigestSchema, type DailyDigest } from "@/lib/schema";
import { fetchTopProducts } from "./fetch-ph";
import { fetchRedditPosts } from "./fetch-reddit";
import { analyzeProducts } from "./analyze";
import { enrichWithNaverTrends } from "./fetch-naver-trends";
import { generateOGImages } from "./og-images";
import type { SourcePost } from "./source-types";

async function main() {
  const dateArg = process.argv[2];
  const today = dateArg || new Date().toISOString().split("T")[0];
  console.log(`[IdeaOasis] Starting daily pipeline for ${today}`);

  // Step 1: Fetch from multiple sources
  console.log("[1/5] Fetching from sources...");

  const [phPosts, redditPosts] = await Promise.all([
    fetchTopProducts(today),
    fetchRedditPosts(),
  ]);

  console.log(`  ProductHunt: ${phPosts.length} posts`);
  console.log(`  Reddit: ${redditPosts.length} posts`);

  // Convert to unified SourcePost format
  const allPosts: SourcePost[] = [
    ...phPosts.map((p) => ({
      id: String(p.id),
      source: "producthunt" as const,
      name: p.name,
      tagline: p.tagline,
      url: p.url,
      votesCount: p.votesCount,
      thumbnailUrl: p.thumbnailUrl,
      createdAt: p.createdAt,
    })),
    ...redditPosts.map((p) => ({
      id: p.id,
      source: "reddit" as const,
      name: p.name,
      tagline: p.tagline,
      url: p.url,
      votesCount: p.votesCount,
      thumbnailUrl: p.thumbnailUrl,
      createdAt: p.createdAt,
    })),
  ];

  if (allPosts.length === 0) {
    console.error("No posts fetched from any source. Skipping today.");
    process.exit(1);
  }

  console.log(`  Total candidates: ${allPosts.length}`);

  // Step 2: Analyze with Claude (picks top 10 across all sources)
  console.log("[2/5] Analyzing with Claude AI...");
  const ideas = await analyzeProducts(allPosts);
  console.log(`  ${ideas.length} ideas curated`);

  // Step 3: Enrich with real Naver DataLab trends (fallback to Claude estimation)
  console.log("[3/5] Fetching Naver DataLab trends...");
  await enrichWithNaverTrends(ideas);

  // Step 4: Validate and write
  console.log("[4/5] Validating and writing digest...");
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

  console.log(`  Wrote ${outPath}`);

  // Step 5: Generate OG images for social sharing
  console.log("[5/5] Generating OG images...");
  try {
    const ogUrls = await generateOGImages(validated);
    console.log(`  Generated ${ogUrls.size} OG images`);
  } catch (err) {
    console.warn("  OG image generation failed (non-fatal):", err);
  }

  console.log(`[IdeaOasis] Done!`);
}

main().catch((err) => {
  console.error("[IdeaOasis] Pipeline failed:", err);
  process.exit(1);
});
