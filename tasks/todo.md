# IdeaOasis — TODOS

## Completed (Phase 2 — Intelligence Layer)

### ✅ Idea Scoring Model
Multi-dimensional scoring (market opportunity, execution difficulty, timing, overall). Sort controls on home page.

### ✅ Korean Competitor Tracker
Claude identifies real Korean startups for each idea. Badge on cards, detailed tracker on idea pages.

### ✅ Idea Bookmarks & Notes
Users save ideas with private notes. /saved page with NoteEditor. BookmarkButton on cards + detail pages.

## Completed (Phase 3 — Community & Sources)

### ✅ Hacker News as Source #3
Show HN posts as third idea source via Firebase API. Full 3-source deduplication in Claude prompt. SourceBadge with amber HN label.

### ✅ Timing Window Analysis
Claude estimates US→Korea time gap per category with real examples (e.g. Notion→Typed). TimingWindow component with color-coded badges and timeline visualization.

### ✅ Discussion Layer
Threaded comments on idea pages via Supabase. 1-level nesting, auth-gated posting, Korean UI. Comments table with RLS policies.

## Completed (Phase 4 — Data Platform)

### ✅ Searchable Idea Database (/explore)
Full-page search + filter + sort across ALL historical ideas. Category multi-select, score presets, difficulty/source/trend toggles. URL-synced filters for shareable searches. Result count, active filter pills, empty state.

### ✅ Community Signals
"나도 만들 거예요" (building) + "이거 쓸래요" (interested) buttons on every idea card + detail page. Supabase-backed with auth toggle, optimistic counts. Proprietary demand/supply data moat.

## P5 — Next Up

### Personalized Digest
Replace one-size-fits-all with personalized digests based on saved ideas, categories, and click history.
- **Why:** Premium retention driver
- **Effort:** L
- **Depends on:** Click/save tracking, enough user data

### Idea Comparison Tool
Side-by-side comparison of 2-3 ideas: scores, timing, competitors, difficulty.
- **Why:** Founders always choosing between options — make it frictionless
- **Effort:** M

### Category Intelligence Reports
Auto-generated per-category weekly snapshots with idea counts, avg scores, trending keywords.
- **Why:** Premium feature that's trivially automated from existing data
- **Effort:** S

### Korean Startup Funding Tracker
Cross-reference categories with Korean VC funding data (TIPS, K-Startup, Crunchbase).
- **Why:** Connects ideas to real capital flow
- **Effort:** L
