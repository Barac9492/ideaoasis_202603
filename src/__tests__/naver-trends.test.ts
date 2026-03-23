import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchNaverTrends } from "@/pipeline/naver-trends";

beforeEach(() => {
  vi.restoreAllMocks();
  process.env.NAVER_CLIENT_ID = "test-id";
  process.env.NAVER_CLIENT_SECRET = "test-secret";
});

const mockNaverResponse = {
  results: [
    {
      title: "ph-100001",
      keywords: ["반려동물 건강"],
      data: [
        { period: "2025-03-01", ratio: 50 },
        { period: "2025-06-01", ratio: 55 },
        { period: "2025-09-01", ratio: 60 },
        { period: "2025-12-01", ratio: 65 },
        { period: "2026-03-01", ratio: 80 },
      ],
    },
  ],
};

describe("fetchNaverTrends", () => {
  it("computes trend correctly on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockNaverResponse),
      })
    );

    const keywords = new Map([["ph-100001", ["반려동물 건강"]]]);
    const result = await fetchNaverTrends(keywords);

    const trend = result.get("ph-100001");
    expect(trend).not.toBeNull();
    expect(trend!.trend_index).toBe(80);
    expect(trend!.trend_direction).toBe("up");
  });

  it("returns null on API failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 })
    );

    const keywords = new Map([["ph-100001", ["test"]]]);
    const result = await fetchNaverTrends(keywords);
    expect(result.get("ph-100001")).toBeNull();
  });

  it("returns null when credentials missing", async () => {
    delete process.env.NAVER_CLIENT_ID;
    delete process.env.NAVER_CLIENT_SECRET;

    const keywords = new Map([["ph-100001", ["test"]]]);
    const result = await fetchNaverTrends(keywords);
    expect(result.get("ph-100001")).toBeNull();
  });
});
