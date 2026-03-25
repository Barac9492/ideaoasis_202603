import { z } from "zod";

export const AnalysisSchema = z.object({
  description: z.string(),
  market_fit: z.string(),
  competitors_kr: z.array(z.string()),
  regulatory_notes: z.string(),
  localization_strategy: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

export const NaverTrendPointSchema = z.object({
  period: z.string(),
  ratio: z.number().min(0).max(100),
});

export const NaverTrendsSchema = z.object({
  keywords: z.array(z.string()),
  trend_index: z.number().min(0).max(100),
  trend_direction: z.enum(["up", "down", "flat"]),
  period: z.string(),
  trend_data: z.array(NaverTrendPointSchema).nullable().optional(),
});

export const IdeaSchema = z.object({
  id: z.string(),
  rank: z.number().int().min(1).max(15),
  source: z.enum(["producthunt", "reddit"]),
  source_url: z.string().url(),
  title_en: z.string(),
  tagline_en: z.string(),
  title_ko: z.string(),
  summary_ko: z.string(),
  analysis_ko: AnalysisSchema,
  naver_trends: NaverTrendsSchema.nullable(),
  category: z.string(),
  ph_votes: z.number().int(),
  thumbnail_url: z.string().nullable(),
  created_at: z.string(),
});

export const DailyDigestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  ideas: z.array(IdeaSchema).min(1).max(15),
  generated_at: z.string(),
});

export const DeepDiveSchema = z.object({
  market_sizing: z.string(),
  localization_playbook: z.array(z.string()),
  comparable_kr_successes: z.array(z.string()),
  estimated_build_timeline: z.string(),
});

export const WeeklyDigestSchema = z.object({
  week: z.string().regex(/^\d{4}-W\d{2}$/),
  selected_idea: IdeaSchema,
  deep_dive_ko: DeepDiveSchema,
});

export type Analysis = z.infer<typeof AnalysisSchema>;
export type NaverTrendPoint = z.infer<typeof NaverTrendPointSchema>;
export type NaverTrends = z.infer<typeof NaverTrendsSchema>;
export type Idea = z.infer<typeof IdeaSchema>;
export type DailyDigest = z.infer<typeof DailyDigestSchema>;
export type DeepDive = z.infer<typeof DeepDiveSchema>;
export type WeeklyDigest = z.infer<typeof WeeklyDigestSchema>;
