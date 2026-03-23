import fs from "node:fs";
import path from "node:path";
import { DailyDigestSchema, type DailyDigest } from "@/lib/schema";
import { fetchTopProducts } from "./fetch-ph";
import { analyzeProducts } from "./analyze";

async function main() {
  const today = new Date().toISOString().split("T")[0];
  console.log(`[IdeaOasis] Starting daily pipeline for ${today}`);

  // Step 1: Fetch from ProductHunt
  console.log("[1/3] Fetching ProductHunt posts...");
  const posts = await fetchTopProducts(today);
  if (posts.length === 0) {
    console.error("No posts fetched from ProductHunt. Skipping today.");
    process.exit(1);
  }
  console.log(`  Found ${posts.length} posts`);

  // Step 2: Analyze with Claude (includes trend estimation)
  console.log("[2/3] Analyzing with Claude AI...");
  const ideas = await analyzeProducts(posts);
  console.log(`  ${ideas.length} ideas curated`);

  // Step 3: Validate and write
  console.log("[3/3] Validating and writing digest...");
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
