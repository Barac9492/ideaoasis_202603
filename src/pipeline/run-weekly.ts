import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { getAllDigestDates, getDigestByDate } from "@/lib/data";
import { WeeklyDigestSchema, IdeaSchema, type Idea } from "@/lib/schema";

function getWeekNumber(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

const DEEP_DIVE_PROMPT = `You are an expert Korean startup market analyst.
Given several startup ideas, select the SINGLE best idea for the Korean market and write a deep-dive analysis.

Output ONLY valid JSON:
{
  "selected_idea_id": "ph-XXXXX",
  "deep_dive_ko": {
    "market_sizing": "Detailed Korean market size analysis with TAM/SAM/SOM",
    "localization_playbook": ["Step 1: ...", "Step 2: ..."],
    "comparable_kr_successes": ["Company — description"],
    "estimated_build_timeline": "MVP X weeks, launch X months"
  }
}

All text must be in Korean. Output ONLY JSON, no markdown.`;

async function main() {
  const week = getWeekNumber(new Date());
  console.log(`[IdeaOasis] Starting weekly pipeline for ${week}`);

  // Collect this week's ideas
  const allDates = getAllDigestDates();
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday

  const weekDates = allDates.filter((d) => {
    const date = new Date(d);
    return date >= weekStart && date <= today;
  });

  if (weekDates.length < 3) {
    console.warn(`Only ${weekDates.length} digests this week (need 3+). Skipping.`);
    process.exit(0);
  }

  const allIdeas: Idea[] = [];
  for (const date of weekDates) {
    const digest = getDigestByDate(date);
    if (digest) allIdeas.push(...digest.ideas);
  }

  console.log(`  ${allIdeas.length} ideas from ${weekDates.length} digests`);

  // Send to Claude for deep dive
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is required");

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    temperature: 0.3,
    system: DEEP_DIVE_PROMPT,
    messages: [
      {
        role: "user",
        content: JSON.stringify(
          allIdeas.map((i) => ({
            id: i.id,
            title_ko: i.title_ko,
            summary_ko: i.summary_ko,
            analysis_ko: i.analysis_ko,
            ph_votes: i.ph_votes,
            naver_trends: i.naver_trends,
          }))
        ),
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  let result: { selected_idea_id: string; deep_dive_ko: unknown };
  try {
    result = JSON.parse(text);
  } catch {
    console.error("Claude returned invalid JSON for weekly");
    process.exit(1);
  }

  const selectedIdea = allIdeas.find((i) => i.id === result.selected_idea_id);
  if (!selectedIdea) {
    console.error(`Selected idea ${result.selected_idea_id} not found`);
    process.exit(1);
  }

  const weekly = WeeklyDigestSchema.parse({
    week,
    selected_idea: selectedIdea,
    deep_dive_ko: result.deep_dive_ko,
  });

  const outDir = path.join(process.cwd(), "data", "weekly");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${week}.json`);
  fs.writeFileSync(outPath, JSON.stringify(weekly, null, 2));

  console.log(`[IdeaOasis] Weekly done! Wrote ${outPath}`);
}

main().catch((err) => {
  console.error("[IdeaOasis] Weekly pipeline failed:", err);
  process.exit(1);
});
