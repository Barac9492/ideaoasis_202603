# IdeaOasis — TODOS

## Completed

### Phase 1 — Foundation
- ✅ Daily pipeline (ProductHunt → Claude → Naver DataLab → JSON → Vercel)
- ✅ Idea detail pages with Korean market analysis
- ✅ OG image auto-generation (Satori + resvg)
- ✅ KakaoTalk share integration
- ✅ Weekly deep-dive digest (Saturdays)
- ✅ RSS/Atom feed
- ✅ Dark mode with Pretendard font

### Phase 2 — Intelligence Layer
- ✅ Multi-dimensional idea scoring (market/execution/timing/overall)
- ✅ Korean competitor tracker (funded year, funding, differentiation)
- ✅ Idea bookmarks with private notes (/saved)
- ✅ Archive with category filtering

### Phase 3 — Community & Sources
- ✅ Hacker News as 3rd source (Show HN via Firebase API)
- ✅ Timing Window Analysis (US→Korea gap with historical examples)
- ✅ Threaded comments on idea pages (Supabase)

### Phase 4 — Data Platform
- ✅ Searchable idea database (/explore) with 6 filters + 5 sorts + URL sync
- ✅ Community signals ("나도 만들 거예요" + "이거 쓸래요")

---

## Phase 5 — Retention & Depth

### Category Intelligence Reports
Auto-generated per-category weekly snapshots: idea count, avg scores, trending keywords, top idea.
- **Why:** Premium feature trivially automated from existing data. Drives category-specific engagement.
- **Effort:** S
- **Depends on:** Enough historical data (2+ weeks)

### Idea Comparison Tool
Side-by-side comparison of 2-3 ideas: scores, timing, competitors, difficulty, Naver trends.
- **Why:** Founders always choosing between options. Makes the decision workflow explicit.
- **Effort:** M

### Personalized Digest
Personalized daily digest based on saved ideas, signal history, and category preferences.
- **Why:** Premium retention driver — "your morning briefing" vs generic top 10
- **Effort:** L
- **Depends on:** Click/save/signal tracking, enough user data

---

## Phase 6 — Data Moat

### Revenue/Traction Benchmarks
Surface rough revenue ranges, user counts, and funding data for Korean competitors in each idea.
- **Why:** The biggest missing data. "How much do Korean versions actually make?" No one provides this.
- **Effort:** L
- **Depends on:** Reliable data source (Crunchbase Korea, TIPS, public disclosures)

### Go-to-Market Playbooks per Category
Structured playbooks: "If you're building a Korean fintech app, here's the regulatory path, timeline, and how 3 successful Korean fintechs got their first 1000 users."
- **Why:** First1000 model, localized. Turns IdeaOasis into an action guide, not just data.
- **Effort:** L

### Korean Startup Funding Tracker
Cross-reference categories with Korean VC funding data (TIPS, K-Startup, Crunchbase).
- **Why:** Connects ideas to real capital flow. "This category saw ₩15B in Korean VC last quarter."
- **Effort:** L

### API / Export for Power Users
Let premium users export filtered data (CSV) or access via API.
- **Why:** Signals "data platform" not "blog." Power users want to manipulate data in their own tools.
- **Effort:** M

---

## Backlog (Unscheduled)

### Signal-Based Leaderboard
Rank ideas by community signal count (building + interested). Surface "most wanted" ideas.

### "I Built This" Success Stories
Let users who declared "I'm building this" share their progress/launch. Creates a feedback loop.

### Multi-Language Support
English version of the analysis for international users exploring Korean market entry.

### Email Digest Enhancement
Weekly email summary with top signals, new high-score ideas, category trends.

### Mobile App (PWA)
Progressive web app with push notifications for new ideas in watched categories.
