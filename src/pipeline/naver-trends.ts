import type { NaverTrends } from "@/lib/schema";

const NAVER_API_URL = "https://openapi.naver.com/v1/datalab/search";

interface NaverResponse {
  results: {
    title: string;
    keywords: string[];
    data: { period: string; ratio: number }[];
  }[];
}

export async function fetchNaverTrends(
  keywordGroups: Map<string, string[]>
): Promise<Map<string, NaverTrends | null>> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  const results = new Map<string, NaverTrends | null>();

  if (!clientId || !clientSecret) {
    console.warn("Naver API credentials not set, skipping trends");
    for (const id of keywordGroups.keys()) {
      results.set(id, null);
    }
    return results;
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  // Naver API accepts up to 5 keyword groups per request
  const entries = Array.from(keywordGroups.entries());

  for (let i = 0; i < entries.length; i += 5) {
    const batch = entries.slice(i, i + 5);
    const keywordGroupsPayload = batch.map(([id, keywords]) => ({
      groupName: id,
      keywords,
    }));

    try {
      const res = await fetch(NAVER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": clientSecret,
        },
        body: JSON.stringify({
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          timeUnit: "month",
          keywordGroups: keywordGroupsPayload,
        }),
      });

      if (!res.ok) {
        console.warn(`Naver API error ${res.status}`);
        for (const [id] of batch) results.set(id, null);
        continue;
      }

      const json = (await res.json()) as NaverResponse;

      for (const result of json.results) {
        const ideaId = result.title;
        const data = result.data;

        if (!data || data.length === 0) {
          results.set(ideaId, null);
          continue;
        }

        const latest = data[data.length - 1].ratio;
        const recentThree = data.slice(-3);
        const avg =
          recentThree.reduce((sum, d) => sum + d.ratio, 0) / recentThree.length;

        const trend_direction =
          latest > avg * 1.05 ? "up" : latest < avg * 0.95 ? "down" : "flat";

        results.set(ideaId, {
          keywords: result.keywords,
          trend_index: Math.round(latest),
          trend_direction,
          period: `${data[0].period} to ${data[data.length - 1].period}`,
        });
      }
    } catch (err) {
      console.warn("Naver API fetch error:", err);
      for (const [id] of batch) results.set(id, null);
    }
  }

  // Ensure all requested IDs have an entry
  for (const id of keywordGroups.keys()) {
    if (!results.has(id)) results.set(id, null);
  }

  return results;
}
