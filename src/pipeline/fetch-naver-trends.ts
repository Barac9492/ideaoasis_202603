/**
 * Naver DataLab Search Trend API integration.
 * Docs: https://developers.naver.com/docs/serviceapi/datalab/search/search.md
 *
 * Requires: NAVER_CLIENT_ID + NAVER_CLIENT_SECRET environment variables.
 * Falls back to null (Claude estimation kept) when API is unavailable.
 */

export interface NaverTrendPoint {
  period: string; // YYYY-MM-DD
  ratio: number; // 0-100 relative search volume
}

export interface NaverTrendResult {
  keywords: string[];
  data: NaverTrendPoint[];
  trend_index: number; // latest ratio value
  trend_direction: "up" | "down" | "flat";
}

const DATALAB_URL = "https://openapi.naver.com/v1/datalab/search";

/**
 * Fetch 12-month search trend from Naver DataLab for given Korean keywords.
 * Returns null if API credentials are missing or the request fails.
 */
export async function fetchNaverTrend(
  keywords: string[]
): Promise<NaverTrendResult | null> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  if (keywords.length === 0) {
    return null;
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const body = {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    timeUnit: "month",
    keywordGroups: [
      {
        groupName: keywords[0],
        keywords: keywords,
      },
    ],
  };

  try {
    const response = await fetch(DATALAB_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.warn(
        `[Naver] API error ${response.status} for keywords: ${keywords.join(", ")}`
      );
      return null;
    }

    const json = await response.json();
    const results = json.results?.[0]?.data as
      | { period: string; ratio: number }[]
      | undefined;

    if (!results || results.length === 0) {
      return null;
    }

    const data: NaverTrendPoint[] = results.map((d) => ({
      period: d.period,
      ratio: Math.round(d.ratio),
    }));

    const latest = data[data.length - 1].ratio;
    const previous = data.length >= 3 ? data[data.length - 3].ratio : latest;
    const direction = computeDirection(latest, previous);

    return {
      keywords,
      data,
      trend_index: latest,
      trend_direction: direction,
    };
  } catch (err) {
    console.warn(`[Naver] Request failed for keywords: ${keywords.join(", ")}`, err);
    return null;
  }
}

function computeDirection(
  latest: number,
  previous: number
): "up" | "down" | "flat" {
  const diff = latest - previous;
  if (diff > 5) return "up";
  if (diff < -5) return "down";
  return "flat";
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

/**
 * Enrich ideas with real Naver DataLab data.
 * For each idea that has naver_trends with keywords, fetches real data.
 * Keeps Claude's estimation as fallback when API fails.
 */
export async function enrichWithNaverTrends<
  T extends {
    naver_trends: {
      keywords: string[];
      trend_index: number;
      trend_direction: "up" | "down" | "flat";
      period: string;
      trend_data?: NaverTrendPoint[] | null;
    } | null;
  },
>(ideas: T[]): Promise<T[]> {
  const clientId = process.env.NAVER_CLIENT_ID;
  if (!clientId) {
    console.log("[Naver] No API credentials — keeping Claude estimations");
    return ideas;
  }

  console.log("[Naver] Enriching with real DataLab data...");
  let enriched = 0;

  for (const idea of ideas) {
    if (!idea.naver_trends?.keywords?.length) continue;

    // Rate limit: Naver allows 1000 requests/day, be conservative
    await sleep(200);

    const result = await fetchNaverTrend(idea.naver_trends.keywords);
    if (result) {
      idea.naver_trends.trend_index = result.trend_index;
      idea.naver_trends.trend_direction = result.trend_direction;
      idea.naver_trends.trend_data = result.data;
      idea.naver_trends.period = `${result.data[0].period} ~ ${result.data[result.data.length - 1].period}`;
      enriched++;
    }
  }

  console.log(`[Naver] Enriched ${enriched}/${ideas.length} ideas with real data`);
  return ideas;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
