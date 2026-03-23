import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchTopProducts } from "@/pipeline/fetch-ph";

const mockPHResponse = {
  data: {
    posts: {
      edges: [
        {
          node: {
            id: "12345",
            name: "Test Product",
            tagline: "A test product",
            url: "https://www.producthunt.com/posts/test",
            votesCount: 100,
            thumbnail: { url: "https://example.com/thumb.png" },
            createdAt: "2026-03-23T00:00:00Z",
          },
        },
      ],
    },
  },
};

beforeEach(() => {
  vi.restoreAllMocks();
  process.env.PH_API_TOKEN = "test-token";
});

describe("fetchTopProducts", () => {
  it("returns parsed posts on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPHResponse),
      })
    );

    const posts = await fetchTopProducts("2026-03-23");
    expect(posts).toHaveLength(1);
    expect(posts[0].name).toBe("Test Product");
    expect(posts[0].votesCount).toBe(100);
  });

  it("returns empty array after retries on 500", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 })
    );

    const posts = await fetchTopProducts("2026-03-23");
    expect(posts).toHaveLength(0);
    expect(fetch).toHaveBeenCalledTimes(3); // 1 + 2 retries
  }, 100_000);

  it("returns empty array on malformed response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: null }),
      })
    );

    const posts = await fetchTopProducts("2026-03-23");
    expect(posts).toHaveLength(0);
  });

  it("throws if no API token", async () => {
    delete process.env.PH_API_TOKEN;
    await expect(fetchTopProducts("2026-03-23")).rejects.toThrow(
      "PH_API_TOKEN is required"
    );
  });
});
