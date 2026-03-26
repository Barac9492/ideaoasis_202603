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

## P4 — Next Up

### Personalized Digest
Replace one-size-fits-all with personalized digests based on saved ideas, categories, and click history.
- **Why:** Premium retention driver
- **Effort:** L
- **Depends on:** Click/save tracking, enough user data

### "I'm Building This" Declarations
Users claim they're building the Korean version. Social proof + urgency.
- **Why:** Seed of co-founder matching, engagement hook
- **Effort:** M
- **Depends on:** Active user base
