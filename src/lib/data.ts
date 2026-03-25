import fs from "node:fs";
import path from "node:path";
import {
  DailyDigestSchema,
  WeeklyDigestSchema,
  type DailyDigest,
  type WeeklyDigest,
  type Idea,
} from "./schema";
import { DIGESTS_PER_ARCHIVE_PAGE } from "./constants";

const DATA_DIR = path.join(process.cwd(), "data");

function readJsonFile<T>(filePath: string, schema: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: unknown } }): T | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    const result = schema.safeParse(parsed);
    if (!result.success) {
      console.warn(`Schema validation failed for ${filePath}:`, result.error);
      return null;
    }
    return result.data as T;
  } catch {
    return null;
  }
}

export function getAllDigestDates(): string[] {
  const dir = path.join(DATA_DIR, "digests");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
    .sort()
    .reverse();
}

export function getDigestByDate(date: string): DailyDigest | null {
  const filePath = path.join(DATA_DIR, "digests", `${date}.json`);
  return readJsonFile(filePath, DailyDigestSchema);
}

export function getLatestDigest(): DailyDigest | null {
  const dates = getAllDigestDates();
  if (dates.length === 0) return null;
  return getDigestByDate(dates[0]);
}

export function getDigestsPaginated(
  page: number,
  perPage: number = DIGESTS_PER_ARCHIVE_PAGE
): { digests: { date: string; ideas: Idea[] }[]; totalPages: number } {
  const allDates = getAllDigestDates();
  const totalPages = Math.max(1, Math.ceil(allDates.length / perPage));
  const start = (page - 1) * perPage;
  const pageDates = allDates.slice(start, start + perPage);

  const digests = pageDates
    .map((date) => {
      const d = getDigestByDate(date);
      return d ? { date: d.date, ideas: d.ideas } : null;
    })
    .filter((d): d is { date: string; ideas: Idea[] } => d !== null);

  return { digests, totalPages };
}

export function getIdeaById(id: string): { idea: Idea; date: string } | null {
  const dates = getAllDigestDates();
  for (const date of dates) {
    const digest = getDigestByDate(date);
    if (!digest) continue;
    const idea = digest.ideas.find((i) => i.id === id);
    if (idea) return { idea, date };
  }
  return null;
}

export function getAllIdeaIds(): string[] {
  const dates = getAllDigestDates();
  const ids: string[] = [];
  for (const date of dates) {
    const digest = getDigestByDate(date);
    if (!digest) continue;
    for (const idea of digest.ideas) {
      ids.push(idea.id);
    }
  }
  return ids;
}

export function getAllIdeasMap(): Record<string, Idea> {
  const map: Record<string, Idea> = {};
  for (const date of getAllDigestDates()) {
    const digest = getDigestByDate(date);
    if (!digest) continue;
    for (const idea of digest.ideas) {
      map[idea.id] = idea;
    }
  }
  return map;
}

export function getAllWeeklyDates(): string[] {
  const dir = path.join(DATA_DIR, "weekly");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
    .sort()
    .reverse();
}

export function getWeeklyByDate(week: string): WeeklyDigest | null {
  const filePath = path.join(DATA_DIR, "weekly", `${week}.json`);
  return readJsonFile(filePath, WeeklyDigestSchema);
}

export function getLatestWeekly(): WeeklyDigest | null {
  const dates = getAllWeeklyDates();
  if (dates.length === 0) return null;
  return getWeeklyByDate(dates[0]);
}
