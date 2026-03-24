import { describe, it, expect } from "vitest";
import { DailyDigestSchema, WeeklyDigestSchema, IdeaSchema } from "@/lib/schema";
import digest1 from "../../data/digests/2026-03-22.json";
import digest2 from "../../data/digests/2026-03-23.json";
import weekly from "../../data/weekly/2026-W12.json";

describe("DailyDigestSchema", () => {
  it("validates sample digest 2026-03-22", () => {
    const result = DailyDigestSchema.safeParse(digest1);
    expect(result.success).toBe(true);
  });

  it("validates sample digest 2026-03-23", () => {
    const result = DailyDigestSchema.safeParse(digest2);
    expect(result.success).toBe(true);
  });

  it("rejects empty ideas array", () => {
    const result = DailyDigestSchema.safeParse({
      date: "2026-01-01",
      ideas: [],
      generated_at: "2026-01-01T00:00:00Z",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = DailyDigestSchema.safeParse({
      ...digest1,
      date: "March 22",
    });
    expect(result.success).toBe(false);
  });
});

describe("WeeklyDigestSchema", () => {
  it("validates sample weekly 2026-W12", () => {
    const result = WeeklyDigestSchema.safeParse(weekly);
    expect(result.success).toBe(true);
  });
});

describe("IdeaSchema", () => {
  it("accepts null naver_trends", () => {
    const idea = { ...digest1.ideas[0], naver_trends: null };
    const result = IdeaSchema.safeParse(idea);
    expect(result.success).toBe(true);
  });

  it("rejects invalid difficulty enum", () => {
    const result = IdeaSchema.safeParse({
      ...digest1.ideas[0],
      analysis_ko: { ...digest1.ideas[0].analysis_ko, difficulty: "Impossible" },
    });
    expect(result.success).toBe(false);
  });
});
