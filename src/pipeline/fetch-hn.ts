export interface HNPost {
  id: string;
  name: string;
  tagline: string;
  url: string;
  votesCount: number;
  thumbnailUrl: string | null;
  createdAt: string;
}

const HN_API = "https://hacker-news.firebaseio.com/v0";
const USER_AGENT = "IdeaOasis/1.0 (startup idea curation)";

interface HNItem {
  id: number;
  title: string;
  url?: string;
  text?: string;
  score: number;
  time: number;
  type: string;
}

async function fetchItem(id: number): Promise<HNItem | null> {
  try {
    const res = await fetch(`${HN_API}/item/${id}.json`, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchHNPosts(): Promise<HNPost[]> {
  try {
    const res = await fetch(`${HN_API}/showstories.json`, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!res.ok) {
      console.warn(`HN showstories returned ${res.status}`);
      return [];
    }

    const storyIds: number[] = await res.json();
    const topIds = storyIds.slice(0, 30);

    const items = await Promise.all(topIds.map(fetchItem));

    return items
      .filter((item): item is HNItem => item !== null)
      .filter((item) => item.score >= 10 && item.url)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((item) => ({
        id: String(item.id),
        name: item.title.replace(/^Show HN:\s*/i, ""),
        tagline: item.text
          ? item.text.slice(0, 200).replace(/<[^>]*>/g, "").replace(/\n/g, " ").trim()
          : item.title,
        url: item.url!,
        votesCount: item.score,
        thumbnailUrl: null,
        createdAt: new Date(item.time * 1000).toISOString(),
      }));
  } catch (err) {
    console.warn("HN fetch error:", err);
    return [];
  }
}
