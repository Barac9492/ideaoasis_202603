import { describe, it, expect } from "vitest";
import {
  getLatestDigest,
  getDigestByDate,
  getIdeaById,
  getDigestsPaginated,
  getAllDigestDates,
} from "@/lib/data";

describe("data readers", () => {
  it("getLatestDigest returns most recent digest", () => {
    const digest = getLatestDigest();
    expect(digest).not.toBeNull();
    expect(digest!.date).toBe("2026-03-23");
  });

  it("getDigestByDate returns correct digest", () => {
    const digest = getDigestByDate("2026-03-22");
    expect(digest).not.toBeNull();
    expect(digest!.ideas).toHaveLength(5);
  });

  it("getDigestByDate returns null for nonexistent date", () => {
    const digest = getDigestByDate("2099-01-01");
    expect(digest).toBeNull();
  });

  it("getIdeaById finds idea across digests", () => {
    const result = getIdeaById("ph-100001");
    expect(result).not.toBeNull();
    expect(result!.date).toBe("2026-03-22");
  });

  it("getDigestsPaginated returns correct page", () => {
    const { digests, totalPages } = getDigestsPaginated(1, 1);
    expect(digests).toHaveLength(1);
    expect(totalPages).toBe(2);
    expect(digests[0].date).toBe("2026-03-23");
  });
});
