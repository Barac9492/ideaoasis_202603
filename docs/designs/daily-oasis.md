---
status: ACTIVE
last_updated: 2026-03-26
---
# IdeaOasis — Product Requirements Document

## Vision

### Mission
Become the most meaningful data source for Korean entrepreneur-wannabes for ideation and exploration. Not a newsletter — a research platform.

### 10x Check
50K Korean entrepreneurs open IdeaOasis daily. The AI identifies timing windows ("This category growing 40% YoY in US, zero Korean players, 6-month window"). Community signals show which ideas have demand and who's building them. The searchable database lets founders query years of curated ideas by any dimension. It becomes the definitive record of idea migration across the Pacific.

### Platonic Ideal
The user opens IdeaOasis at 7 AM with coffee. Ten beautiful cards across ProductHunt, Reddit, and Hacker News. Each makes them think "I could build that." They tap one — rich Korean analysis with real Naver search data, competitor gaps, timing window estimates, regulatory notes. They click "나도 만들 거예요" and see 3 others are already building it. They go to /explore, filter by AI category + 70+ score, find 15 ideas from the past month worth comparing. They screenshot the best one and send to their co-founder via KakaoTalk.

## What's Built (Current State)

### Phase 1 — Foundation
- Daily pipeline: ProductHunt API + Claude analysis + Naver DataLab trends
- Static site generation (Next.js 15 + Vercel)
- Individual idea pages with Korean market analysis
- OG image auto-generation for social sharing
- KakaoTalk share integration
- Weekly deep-dive digest (Saturdays)
- RSS/Atom feed
- Dark mode with Korean aesthetic (Pretendard font)

### Phase 2 — Intelligence Layer
- Multi-dimensional idea scoring (market opportunity, execution difficulty, timing, overall 0-100)
- Korean competitor tracker with founded year, funding status, differentiation
- Idea bookmarks with private notes (/saved page)
- Archive with category filtering

### Phase 3 — Community & Sources
- Hacker News as 3rd source (Show HN via Firebase API)
- 3-source deduplication in Claude prompt
- Timing Window Analysis (US→Korea gap per category with historical examples)
- Threaded comments on idea pages (Supabase, 1-level nesting, auth-gated)

### Phase 4 — Data Platform
- Searchable idea database (/explore) with text search + 6 combinable filters + 5 sort modes
- URL-synced filters for shareable searches
- Community signals: "나도 만들 거예요" (building) + "이거 쓸래요" (interested) per idea
- Supabase-backed with auth toggle and optimistic counts

## Architecture

### Tech Stack
- **Frontend:** Next.js 15 (App Router), React 19, TailwindCSS 4, TypeScript
- **Data:** JSON files in `data/digests/{date}.json` (SSG-friendly, git-versioned)
- **Database:** Supabase (auth, profiles, saved_ideas, comments, idea_signals)
- **Payments:** Stripe (₩9,900/mo or ₩99,000/yr premium)
- **AI:** Claude Sonnet 4 (analysis + curation)
- **APIs:** ProductHunt GraphQL, Reddit JSON, HN Firebase, Naver DataLab
- **Email:** Resend (category alerts)
- **Hosting:** Vercel (static generation)
- **Analytics:** Plausible
- **Font:** Pretendard (self-hosted)

### Pipeline (Daily at 5 AM KST)
1. Fetch: ProductHunt + Reddit + Hacker News (parallel)
2. Analyze: Claude selects top 10, generates Korean analysis + scoring + competitors + timing window
3. Enrich: Naver DataLab real search trends (fallback to Claude estimation)
4. Validate: Zod schema validation
5. Write: `data/digests/{date}.json`
6. Generate: OG images (Satori + resvg)
7. Deploy: git push → Vercel auto-deploy

### Data Schema (per idea)
```
id, rank, source (producthunt|reddit|hackernews), source_url
title_en, tagline_en, title_ko, summary_ko
analysis_ko: { description, market_fit, competitors_kr, competitors_kr_detailed[], regulatory_notes, localization_strategy, difficulty }
score: { market_opportunity, execution_difficulty, timing, overall } (0-100)
naver_trends: { keywords[], trend_index, trend_direction, period, trend_data[] }
timing_window: { avg_months, category_history[] } (nullable)
category, ph_votes, thumbnail_url, created_at
```

### Supabase Tables
- `profiles` — id, email, is_premium, stripe_customer_id, alert_categories[]
- `saved_ideas` — user_id, idea_id, notes
- `comments` — user_id, idea_id, parent_id, content (1-2000 chars)
- `idea_signals` — user_id, idea_id, signal_type (building|interested)

### Pages
- `/` — Today's digest (top 10, sort by rank/score/market/timing)
- `/explore` — Searchable database (text search, 6 filters, 5 sorts, URL-synced)
- `/idea/[id]` — Full analysis + score breakdown + competitors + timing + signals + comments
- `/archive/[page]` — Historical digests by date, category filter
- `/weekly/[date]` — Saturday deep dive (market sizing, localization playbook)
- `/saved` — Bookmarked ideas with notes
- `/settings` — Category email alerts (premium)
- `/pricing` — Free vs Premium tiers
- `/login`, `/auth` — Supabase magic link auth

### Free vs Premium
| Feature | Free | Premium |
|---------|------|---------|
| Daily ideas | 5 | 10 |
| Korean analysis | Yes | Yes |
| Naver trends | Yes | Yes |
| Archive + Explore | Yes | Yes |
| Bookmarks + Notes | Yes | Yes |
| Comments + Signals | Yes | Yes |
| Category email alerts | No | Yes |
| Weekly deep dives | No | Yes |

## Data Sources

| Source | API | Content | Filter |
|--------|-----|---------|--------|
| ProductHunt | GraphQL (PH_API_TOKEN) | Top new products by date | By votes, top 10 |
| Reddit | Public JSON | r/startups, r/SideProject, r/EntrepreneurRideAlong | 5+ upvotes, >50 chars, top 10 |
| Hacker News | Firebase (no auth) | Show HN stories | 10+ score, has URL, top 10 |
| Naver DataLab | REST (client credentials) | 12-month Korean search trends | Per-idea keyword enrichment |

## Categories (10)
fintech, healthtech, edtech, ecommerce, saas, ai, social, creator, productivity, lifestyle

## API Keys (GitHub Actions secrets)
- `PH_API_TOKEN` — ProductHunt
- `ANTHROPIC_API_KEY` — Claude
- `NAVER_CLIENT_ID` + `NAVER_CLIENT_SECRET` — Naver DataLab
- `NEXT_PUBLIC_KAKAO_JS_KEY` — KakaoTalk share
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase
- `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` — Stripe
- `RESEND_API_KEY` — Email alerts

## Competitive Moat

Three layers of defensibility:
1. **Aggregation + interpretation:** 3 sources → Claude → Korean-specific analysis with Naver trends. No English platform does this.
2. **Data accumulation:** 365 days x 10 ideas = 3,650 ideas/year with scores, trends, competitors, timing windows. Historical dataset becomes irreplaceable.
3. **Community signals:** "I'm building this" + "I'd use this" votes create proprietary intent data unique to IdeaOasis.
