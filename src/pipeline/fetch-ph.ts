export interface PHPost {
  id: number;
  name: string;
  tagline: string;
  url: string;
  votesCount: number;
  thumbnailUrl: string | null;
  createdAt: string;
}

const PH_API_URL = "https://api.producthunt.com/v2/api/graphql";

const QUERY = `
  query GetPosts($postedAfter: DateTime!, $postedBefore: DateTime!, $first: Int!) {
    posts(order: VOTES, postedAfter: $postedAfter, postedBefore: $postedBefore, first: $first) {
      edges {
        node {
          id
          name
          tagline
          url
          votesCount
          thumbnail { url }
          createdAt
        }
      }
    }
  }
`;

async function fetchWithRetry(
  token: string,
  variables: Record<string, unknown>,
  retries = 2
): Promise<PHPost[]> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(PH_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: QUERY, variables }),
      });

      if (res.status === 429) {
        console.warn(`PH API rate limited (attempt ${attempt + 1})`);
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 30_000));
          continue;
        }
        return [];
      }

      if (!res.ok) {
        console.warn(`PH API error ${res.status} (attempt ${attempt + 1})`);
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 30_000));
          continue;
        }
        return [];
      }

      const json = await res.json();
      const edges = json?.data?.posts?.edges;
      if (!Array.isArray(edges)) {
        console.warn("PH API returned unexpected format");
        return [];
      }

      return edges.map((edge: Record<string, Record<string, unknown>>) => ({
        id: Number(edge.node.id),
        name: String(edge.node.name),
        tagline: String(edge.node.tagline),
        url: String(edge.node.url),
        votesCount: Number(edge.node.votesCount),
        thumbnailUrl: (edge.node.thumbnail as Record<string, string> | null)?.url ?? null,
        createdAt: String(edge.node.createdAt),
      }));
    } catch (err) {
      console.warn(`PH API fetch error (attempt ${attempt + 1}):`, err);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 30_000));
      }
    }
  }
  return [];
}

export async function fetchTopProducts(
  date?: string,
  count = 10
): Promise<PHPost[]> {
  const token = process.env.PH_API_TOKEN;
  if (!token) throw new Error("PH_API_TOKEN is required");

  const targetDate = date || new Date().toISOString().split("T")[0];
  const postedAfter = `${targetDate}T00:00:00Z`;
  const postedBefore = `${targetDate}T23:59:59Z`;

  return fetchWithRetry(token, { postedAfter, postedBefore, first: count });
}
