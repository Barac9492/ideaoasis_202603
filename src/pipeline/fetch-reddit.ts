export interface RedditPost {
  id: string;
  name: string;
  tagline: string;
  url: string;
  votesCount: number;
  thumbnailUrl: string | null;
  createdAt: string;
  subreddit: string;
}

const SUBREDDITS = ["startups", "SideProject", "EntrepreneurRideAlong"];
const USER_AGENT = "IdeaOasis/1.0 (startup idea curation)";

interface RedditChild {
  data: {
    id: string;
    title: string;
    selftext: string;
    url: string;
    permalink: string;
    ups: number;
    thumbnail: string;
    created_utc: number;
    subreddit: string;
    link_flair_text?: string;
    is_self: boolean;
  };
}

async function fetchSubreddit(
  subreddit: string,
  limit = 10
): Promise<RedditPost[]> {
  const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}&t=day`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (!res.ok) {
      console.warn(`Reddit r/${subreddit} returned ${res.status}`);
      return [];
    }

    const json = await res.json();
    const children: RedditChild[] = json?.data?.children ?? [];

    return children
      .filter((c) => !c.data.is_self || c.data.selftext.length > 50)
      .filter((c) => c.data.ups >= 5)
      .map((c) => ({
        id: c.data.id,
        name: c.data.title.slice(0, 120),
        tagline: c.data.selftext
          ? c.data.selftext.slice(0, 200).replace(/\n/g, " ").trim()
          : c.data.title,
        url: c.data.is_self
          ? `https://www.reddit.com${c.data.permalink}`
          : c.data.url,
        votesCount: c.data.ups,
        thumbnailUrl:
          c.data.thumbnail && c.data.thumbnail.startsWith("http")
            ? c.data.thumbnail
            : null,
        createdAt: new Date(c.data.created_utc * 1000).toISOString(),
        subreddit: c.data.subreddit,
      }));
  } catch (err) {
    console.warn(`Reddit r/${subreddit} fetch error:`, err);
    return [];
  }
}

export async function fetchRedditPosts(): Promise<RedditPost[]> {
  const results = await Promise.all(
    SUBREDDITS.map((sub) => fetchSubreddit(sub))
  );

  const all = results.flat();

  // Sort by votes descending, take top 10
  all.sort((a, b) => b.votesCount - a.votesCount);
  return all.slice(0, 10);
}
