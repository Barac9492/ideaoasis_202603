import { describe, it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("RSS feed generation", () => {
  const feedPath = path.join(process.cwd(), "public", "feed.xml");

  beforeAll(async () => {
    // Generate the feed
    const { generateRSS } = await import("@/pipeline/rss");
    // The module auto-runs, but we call it explicitly for tests
    // generateRSS is called on import via the bottom of rss.ts
  });

  it("generates valid XML", () => {
    // The import should have generated the file
    expect(fs.existsSync(feedPath)).toBe(true);
    const content = fs.readFileSync(feedPath, "utf-8");
    expect(content).toContain('<?xml version="1.0"');
    expect(content).toContain("<feed");
  });

  it("contains Korean titles", () => {
    const content = fs.readFileSync(feedPath, "utf-8");
    expect(content).toContain("IdeaOasis");
    expect(content).toContain("오늘의 TOP 5");
  });
});
