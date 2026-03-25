import Anthropic from "@anthropic-ai/sdk";
import { IdeaSchema, type Idea } from "@/lib/schema";
import { CATEGORY_IDS } from "@/lib/categories";
import type { SourcePost } from "./source-types";

const SYSTEM_PROMPT = `You are an expert startup analyst specializing in the Korean market.
You will receive a list of products from multiple sources (ProductHunt, Reddit). Your job:
1. Select the top 10 most interesting/novel ideas for Korean entrepreneurs across ALL sources
2. For each, provide a full Korean market analysis
3. For each, estimate Korean search interest (0-100 scale) based on your knowledge of Korean market trends
4. For each, assign exactly one category from this list: ${CATEGORY_IDS.join(", ")}
5. DEDUPLICATION: If the same idea/product appears from multiple sources, merge them into one entry using the source with more detail

Each product in the input has a "source" field ("producthunt" or "reddit"). Use it for the id and source fields.

Output ONLY valid JSON array matching this schema for each idea:
{
  "id": "{source_prefix}-{id}" (use "ph-" for producthunt, "reddit-" for reddit),
  "rank": 1-10,
  "source": "producthunt" or "reddit" (match the input source),
  "source_url": "{product_url}",
  "title_en": "{english_name}",
  "tagline_en": "{english_tagline}",
  "title_ko": "{korean_translated_name}",
  "summary_ko": "{korean_one_line_summary}",
  "analysis_ko": {
    "description": "{detailed_korean_description_2_3_sentences}",
    "market_fit": "{korean_market_fit_analysis_2_3_sentences}",
    "competitors_kr": ["{korean_competitor_names}"],
    "regulatory_notes": "{korean_regulatory_considerations}",
    "localization_strategy": "{korean_localization_strategy}",
    "difficulty": "Easy|Medium|Hard"
  },
  "naver_trends": {
    "keywords": ["{1_2_relevant_korean_search_keywords}"],
    "trend_index": {estimated_0_to_100_korean_search_interest},
    "trend_direction": "up|down|flat",
    "period": "estimated"
  },
  "category": "{one_of_the_category_ids}",
  "ph_votes": {votes_count_from_any_source},
  "thumbnail_url": "{thumbnail_or_null}",
  "created_at": "{iso_datetime}"
}

For naver_trends: estimate based on your knowledge of Korean consumer behavior and market trends.
Set trend_direction to "up" if the category is growing in Korea, "flat" if stable, "down" if declining.
If you cannot reasonably estimate, set naver_trends to null.

Output ONLY the JSON array, no markdown, no explanation.`;

export async function analyzeProducts(posts: SourcePost[]): Promise<Idea[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is required");

  const client = new Anthropic({ apiKey });

  const userMessage = JSON.stringify(
    posts.map((p) => ({
      id: p.id,
      source: p.source,
      name: p.name,
      tagline: p.tagline,
      url: p.url,
      votesCount: p.votesCount,
      thumbnailUrl: p.thumbnailUrl,
      createdAt: p.createdAt,
    }))
  );

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    temperature: 0.3,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  let text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Strip markdown code fences if Claude wraps the JSON
  text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

  let rawIdeas: unknown[];
  try {
    rawIdeas = JSON.parse(text);
  } catch {
    console.error("Claude returned invalid JSON:", text.slice(0, 200));
    throw new Error("Claude returned invalid JSON");
  }

  if (!Array.isArray(rawIdeas)) {
    throw new Error("Claude did not return an array");
  }

  const ideas: Idea[] = [];

  for (const raw of rawIdeas) {
    const result = IdeaSchema.safeParse(raw);
    if (result.success) {
      ideas.push(result.data);
    } else {
      console.warn(`Skipping idea (validation failed):`, result.error.issues);
    }
  }

  if (ideas.length < 3) {
    throw new Error(
      `Only ${ideas.length} ideas passed validation (minimum 3 required)`
    );
  }

  console.log(`Analyzed ${ideas.length} ideas (${rawIdeas.length} from Claude)`);
  return ideas;
}
