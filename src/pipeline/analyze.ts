import Anthropic from "@anthropic-ai/sdk";
import { IdeaSchema, type Idea } from "@/lib/schema";
import { CATEGORY_IDS } from "@/lib/categories";
import type { SourcePost } from "./source-types";

const SYSTEM_PROMPT = `You are an expert startup analyst specializing in the Korean market.
You will receive a list of products from multiple sources (ProductHunt, Reddit, Hacker News). Your job:
1. Select the top 10 most interesting/novel ideas for Korean entrepreneurs across ALL sources
2. For each, provide a full Korean market analysis
3. For each, estimate Korean search interest (0-100 scale) based on your knowledge of Korean market trends
4. For each, assign exactly one category from this list: ${CATEGORY_IDS.join(", ")}
5. DEDUPLICATION: If the same idea/product appears from multiple sources, merge them into one entry using the source with more detail

Each product in the input has a "source" field ("producthunt", "reddit", or "hackernews"). Use it for the id and source fields.

Output ONLY valid JSON array matching this schema for each idea:
{
  "id": "{source_prefix}-{id}" (use "ph-" for producthunt, "reddit-" for reddit, "hn-" for hackernews),
  "rank": 1-10,
  "source": "producthunt" or "reddit" or "hackernews" (match the input source),
  "source_url": "{product_url}",
  "title_en": "{english_name}",
  "tagline_en": "{english_tagline}",
  "title_ko": "{korean_translated_name}",
  "summary_ko": "{korean_one_line_summary}",
  "analysis_ko": {
    "description": "{detailed_korean_description_2_3_sentences}",
    "market_fit": "{korean_market_fit_analysis_2_3_sentences}",
    "competitors_kr": ["{korean_competitor_names}"],
    "competitors_kr_detailed": [
      {
        "name": "{korean_company_name}",
        "founded_year": 2024,
        "funding_status": "{e.g. Seed $1M, Series A, bootstrapped, unknown}",
        "differentiation": "{how_the_original_idea_differs_from_this_korean_competitor}"
      }
    ],
    "regulatory_notes": "{korean_regulatory_considerations}",
    "localization_strategy": "{korean_localization_strategy}",
    "difficulty": "Easy|Medium|Hard"
  },
  "score": {
    "market_opportunity": {0-100, based on Korean TAM size, growth rate, competitive density},
    "execution_difficulty": {0-100, higher means EASIER to execute. Based on tech complexity, regulatory burden, capital requirements},
    "timing": {0-100, how ready is the Korean market right now},
    "overall": {weighted: round(market_opportunity * 0.4 + execution_difficulty * 0.3 + timing * 0.3)}
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
  "created_at": "{iso_datetime}",
  "timing_window": {
    "avg_months": {average_months_for_US_to_Korea_equivalent_in_this_category},
    "category_history": [
      {"us_launch": "US Product (year)", "kr_equivalent": "KR Equivalent (year)", "gap_months": 24}
    ]
  }
}

For naver_trends: estimate based on your knowledge of Korean consumer behavior and market trends.
Set trend_direction to "up" if the category is growing in Korea, "flat" if stable, "down" if declining.
If you cannot reasonably estimate, set naver_trends to null.

For competitors_kr_detailed: identify REAL Korean startups/companies building the same or very similar product.
Only include confirmed companies you are confident exist. Return empty array [] if no Korean competitor exists.
Keep competitors_kr as the simple name list (same as before), and competitors_kr_detailed as the enriched version.

For score: evaluate each dimension independently.
- market_opportunity: Korean TAM size, growth trajectory, how crowded the space is (higher = bigger opportunity)
- execution_difficulty: higher means EASIER (less technical complexity, lighter regulatory burden, lower capital needed)
- timing: how ready Korean consumers/businesses are for this (higher = market is ready now)
- overall: MUST equal round(market_opportunity * 0.4 + execution_difficulty * 0.3 + timing * 0.3)

For timing_window: estimate how long it typically takes for this category of product to get a Korean equivalent.
- avg_months: average months between a US product launching and a Korean clone/equivalent appearing in this category
- category_history: 1-3 real examples of US→Korea timing you are confident about (e.g. Notion→Typed, Slack→잔디)
- If you cannot reasonably estimate, set timing_window to null.

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
    max_tokens: 12288,
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
