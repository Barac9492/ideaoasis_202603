# IdeaOasis — Product Requirements Document

## What This Is

IdeaOasis is the definitive record of startup idea migration from Silicon Valley to Korea. Every morning, it scrapes ProductHunt, uses Claude to curate the top 10 ideas, analyzes each through a Korean market lens, and publishes a daily digest for Korean entrepreneurs. Free users see 5 ideas. Premium users see all 10 + category email alerts.

The end goal is not a content site. It's a **Korean startup intelligence platform** — the place where 50,000 Korean entrepreneurs check every morning before they check anything else.

---

## The Problem

Korean entrepreneurs are disconnected from global startup ideas by a language barrier and a context barrier. The language barrier is shrinking (translation is cheap). The context barrier is not — knowing that a pet insurance startup raised $50M in the US tells you nothing about whether 펫 보험 works in Korea, who the Korean competitors are, what regulations apply, or whether Korean consumers are even searching for it.

IdeaBrowser (English) does 80% of the curation. Disquiet (Korean) does community. Nobody does **Korean market intelligence on global ideas** — the specific analysis of "should a Korean entrepreneur build this, and how?"

---

## Users

**Primary:** Korean entrepreneurs (25-45) actively looking for their next idea. They read ProductHunt in English but want Korean market context. They share links via KakaoTalk, not email. They open their phones at 7 AM KST.

**Secondary:** Korean VCs and accelerator managers scouting for trends crossing the Pacific. They want the trend tracking and competitive intelligence.

**Tertiary:** Korean product managers at companies like Naver, Kakao, Coupang who watch for ideas that could become features in their platforms.

---

## What Exists Today (v1.0)

| Feature | Status | Details |
|---------|--------|---------|
| Daily digest (10 ideas) | Live | PH API → Claude → JSON → Vercel SSG |
| Korean market analysis | Live | Market fit, competitors, regulatory notes, localization strategy per idea |
| Naver trend estimation | Live | Claude estimates Korean search interest (0-100) |
| Freemium gating | Live | 5 free, 5 blurred behind paywall |
| Supabase auth | Built | Google/GitHub OAuth + email magic link |
| Category alerts | Built | 10 categories, email via Resend for premium users |
| Weekly deep dive | Live | Saturday best-of with TAM/SAM/SOM, localization playbook |
| Dark mode | Live | Korean aesthetic (Toss/Baemin-inspired) |
| Archive | Live | 7 days, 70 ideas, paginated |
| RSS feed | Live | Last 30 digests, Atom format |
| OG images | Built | Satori + local PNG generation |
| Design system | Done | DESIGN.md — blue accent, Instrument Serif, Pretendard, 640px editorial |

---

## End Goal (v3.0) — Korean Startup Intelligence Platform

### Phase 1: Content Machine (v1.0 → v1.5) — Weeks 1-4

The immediate priority is making the daily content engine bulletproof and growing the audience from 0 to 1,000 daily visitors.

**1.1 Multi-source pipeline**
- Add Reddit (r/startups, r/SideProject, r/EntrepreneurRideAlong) as source #2
- Add Hacker News (Show HN) as source #3
- Deduplication: same idea appearing on PH and Reddit should merge, not duplicate
- Claude receives all sources, picks top 10 across all of them
- Each idea shows source badges (PH, Reddit, HN)

**1.2 Real Naver DataLab integration**
- Replace Claude's trend estimation with actual Naver Search Trend API data
- Show 12-month trend line chart on idea detail page
- Requires: Naver Developer account, `NAVER_CLIENT_ID` + `NAVER_CLIENT_SECRET`
- Fallback: Claude estimation when API fails (current behavior)

**1.3 SEO foundation**
- Korean sitemap.xml generation
- Structured data (JSON-LD) for each idea page: Article schema with Korean headline
- Target keywords: "스타트업 아이디어", "사이드 프로젝트", "창업 아이디어 2026"
- Meta descriptions in Korean for each page
- OG images deployed to Cloudinary (not local git) for proper social previews

**1.4 Launch & distribution**
- Post on Disquiet.io with Korean-language launch post
- Launch on ProductHunt (a site about ProductHunt ideas — meta)
- Share on Korean startup Twitter/X accounts
- Submit to Korean startup newsletters (eo, Startup Weekly Korea)
- KakaoTalk open channel for community

**1.5 Analytics**
- Vercel Analytics or Plausible (privacy-friendly, no cookies)
- Track: daily visitors, page views per idea, archive depth, premium conversion
- Weekly automated report to founder via email

### Phase 2: Intelligence Layer (v2.0) — Months 2-3

This is where IdeaOasis stops being a content site and becomes an intelligence tool.

**2.1 Korean Competitor Tracker**
- For each featured idea, AI searches for Korean startups building the same thing
- Data sources: Crunchbase Korea, TIPS portfolio, Korean startup databases, Naver news search
- Display: "🇰🇷 이미 한국에서 시작!" badge on idea card when match found
- Detail: Korean competitor name, founding date, funding status, how they differ
- Over time, this builds a unique dataset: which global ideas get built in Korea, how fast, by whom

**2.2 Timing window analysis**
- For each category, track the gap between US launch and Korean equivalent appearing
- Display: "This category typically takes 6-12 months to cross the Pacific"
- Identify categories where Korea is AHEAD of the US (gaming, social commerce, super apps)
- Weekly "Timing Report" — which categories have the widest US-Korea gap right now

**2.3 Idea scoring model**
- Move beyond simple rank (1-10) to a multi-dimensional score:
  - **Market Opportunity** (0-100): Korean TAM estimate, growth rate, competitive density
  - **Execution Difficulty** (0-100): Technical complexity, regulatory burden, capital requirements
  - **Timing** (0-100): Is the Korean market ready? Too early? Too late?
  - **Overall Score**: Weighted composite displayed as a single number
- Users can filter/sort by score dimensions ("show me high-opportunity, low-difficulty ideas")

**2.4 Personalized digest**
- Replace the one-size-fits-all daily email with personalized digests
- Based on: selected categories, past idea saves/clicks, industry background
- Premium users get "Your Daily 5" — the 5 most relevant ideas for THEM, not the 5 most popular overall
- Requires: click/save tracking (Supabase events table), recommendation algorithm (Claude + collaborative filtering)

**2.5 Idea bookmarks & notes**
- Logged-in users can save ideas to a personal collection
- Add private notes to saved ideas ("talk to [friend] about this", "competitor to my current project")
- Saved ideas dashboard at `/saved`
- Weekly email: "You saved 3 ideas this week. Here's what happened since."

### Phase 3: Community & Monetization (v3.0) — Months 4-6

**3.1 Discussion layer**
- Comments on each idea page (Supabase real-time)
- Threaded replies, upvotes, user profiles with bio + links
- Moderation: Claude-powered auto-moderation for spam/toxicity
- "Best Comment" badge for the most insightful Korean market perspective
- This is where IdeaOasis becomes a community, not just a publication

**3.2 "I'm Building This" declarations**
- Any user can claim "I'm building the Korean version of this idea"
- Shows on the idea page: "3명이 이 아이디어를 한국에서 만들고 있습니다"
- Links to their Disquiet/LinkedIn/website
- Seed of the co-founder matching feature (original 10x vision)
- Creates social proof and urgency — "someone else is already working on this"

**3.3 Stripe payment integration**
- Pricing: ₩9,900/month or ₩99,000/year (2 months free)
- Payment page at `/pricing` with feature comparison (free vs premium)
- Stripe Checkout → Supabase webhook → `is_premium = true`
- 7-day free trial for new signups
- Cancellation flow with retention offer ("3 months at 50% off")

**3.4 Team/enterprise tier**
- ₩49,900/month for teams of up to 5
- Shared saved ideas collection
- Team notes on ideas
- Weekly team digest email
- Target: VC firms, accelerator cohorts, corporate innovation teams

**3.5 Sponsored ideas (native advertising)**
- Korean startups can pay to feature their product as a "Sponsored Idea" in the daily digest
- Clearly labeled "스폰서" badge — never disguised as organic
- Pricing: ₩500,000/week for one sponsored slot in the daily digest
- Max 1 sponsored idea per day (quality over quantity)
- Must pass editorial quality bar (Claude reviews the submission)

---

## Technical Architecture — End State

```
┌─────────────────────────────────────────────────────────┐
│                    Data Pipeline                        │
│                                                         │
│  ProductHunt ─┐                                         │
│  Reddit ──────┼→ Claude (curation + analysis) ──┐       │
│  Hacker News ─┘                                 │       │
│                                                 ▼       │
│  Naver DataLab ──→ Trend enrichment ──→ Supabase DB     │
│  Korean startup DBs ──→ Competitor matching ──┘         │
│                                                         │
│  Scheduled: GitHub Actions (daily 5 AM, weekly Sat)     │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                    Application                          │
│                                                         │
│  Next.js (SSR, not static export)                       │
│  ├── Public pages: SSG (homepage, archive, idea detail) │
│  ├── Auth pages: CSR (login, settings, saved)           │
│  ├── API routes: /api/save, /api/comment, /api/stripe   │
│  └── Real-time: Supabase subscriptions (comments)       │
│                                                         │
│  Database: Supabase PostgreSQL                          │
│  ├── profiles (id, email, is_premium, categories, bio)  │
│  ├── saved_ideas (user_id, idea_id, notes, saved_at)    │
│  ├── comments (id, idea_id, user_id, body, parent_id)   │
│  ├── building_claims (user_id, idea_id, url, status)    │
│  ├── events (user_id, event_type, idea_id, timestamp)   │
│  └── digests (date, ideas JSONB, generated_at)          │
│                                                         │
│  Auth: Supabase Auth (email, Google, GitHub, Kakao)     │
│  Payments: Stripe Checkout + webhooks                   │
│  Email: Resend (alerts, weekly recap, onboarding)       │
│  Analytics: Plausible (privacy-friendly)                │
│  CDN: Cloudinary (OG images)                            │
│  Deploy: Vercel (Pro plan for SSR + API routes)         │
└─────────────────────────────────────────────────────────┘
```

**Key migration: Static → SSR.** The current `output: 'export'` architecture works for a content site but won't support API routes, comments, or real-time features. Phase 2 requires migrating to standard Next.js deployment on Vercel (remove `output: 'export'`, add API routes). The data also migrates from JSON-in-git to Supabase PostgreSQL.

**Key migration: Git data → Supabase.** Currently, digests are JSON files committed to git. This works beautifully for a static site but doesn't support user interactions (saves, comments, scores). Phase 2 moves digest data into Supabase while keeping git as the pipeline's commit-and-deploy mechanism.

---

## Revenue Model

| Source | Price | Target | Timeline |
|--------|-------|--------|----------|
| Premium individual | ₩9,900/mo or ₩99,000/yr | 500 subscribers by month 6 | Phase 3 |
| Team/enterprise | ₩49,900/mo (5 seats) | 20 teams by month 6 | Phase 3 |
| Sponsored ideas | ₩500,000/week | 2 sponsors/month by month 6 | Phase 3 |

**Revenue target (month 6):** ₩500K individual + ₩1M team + ₩1M sponsors = **₩2.5M/month** (~$1,800 USD)

**Revenue target (month 12):** 2,000 individual + 50 teams + 4 sponsors/month = **₩27.4M/month** (~$20,000 USD)

This is a lifestyle business at month 6, ramen profitable at month 12. Not a venture-scale outcome — but a real business that funds itself and grows organically.

---

## Success Metrics

### Phase 1 (Months 1-2)
| Metric | Target | How to measure |
|--------|--------|---------------|
| Daily unique visitors | 1,000 | Plausible analytics |
| Archive depth | 30+ days continuous | Count digest files |
| Pipeline uptime | 95%+ (no more than 1 missed day/month) | GitHub Actions history |
| Social shares | 50/week | Track KakaoTalk/X share clicks |
| Email subscribers | 200 | Supabase profiles count |

### Phase 2 (Months 2-4)
| Metric | Target | How to measure |
|--------|--------|---------------|
| Daily unique visitors | 5,000 | Plausible |
| Ideas with Korean competitor data | 30%+ | Competitor tracker coverage |
| Saved ideas per active user | 3+/week | Supabase events |
| Premium conversion (free → trial) | 5% | Stripe + Supabase |
| Retention (day 30) | 40% | Plausible cohorts |

### Phase 3 (Months 4-6)
| Metric | Target | How to measure |
|--------|--------|---------------|
| Daily unique visitors | 10,000 | Plausible |
| Paying subscribers | 500 | Stripe |
| Monthly revenue | ₩2.5M+ | Stripe |
| Comments per idea | 2+ average | Supabase |
| "Building This" claims | 50 total | Supabase |
| NPS | 50+ | In-app survey |

---

## What We're NOT Building

- **A social network.** Disquiet already exists. IdeaOasis is a publication with a thin social layer, not a community platform.
- **An AI idea generator.** We curate REAL ideas from REAL products, not hallucinated concepts. The ideas come from ProductHunt/Reddit/HN — they're products that actual teams built and shipped.
- **A full startup toolkit.** No landing page builders, no pitch deck generators, no financial modeling. Stay focused on intelligence and curation.
- **An English version.** Korean is the entire moat. The moment we translate to English, we're competing with IdeaBrowser, ProductHunt, and a hundred other aggregators. Korean market intelligence is the defensible position.
- **A mobile app.** The web works fine. Mobile-responsive PWA at most. Don't fragment the engineering effort.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| ProductHunt API changes/breaks | Medium | High | Add Reddit + HN as backup sources. Cache 7 days of raw data. |
| Claude API cost grows with usage | Medium | Medium | Use Sonnet (not Opus) for daily runs. Cache analysis for repeat ideas. Budget: ~$50/month at 10 ideas/day. |
| Korean entrepreneurs don't care | Medium | Fatal | Validate with Disquiet community post before building Phase 2. If <100 signups in first month, pivot or kill. |
| IdeaBrowser adds Korean support | Low | High | Move fast on the competitor tracker and timing analysis — those are features IdeaBrowser can't easily replicate without deep Korean market knowledge. |
| Regulatory issues with scraping/aggregation | Low | Medium | PH has an official API (we use it). Reddit has terms — respect rate limits. Never republish full product descriptions. |

---

## Implementation Priority (Next 30 Days)

- [ ] **Set up Supabase** — create project, run SQL, add env vars to Vercel. The auth system is built but non-functional without this.
- [x] **Remove OAuth buttons** — email magic link only until Google/GitHub OAuth is configured. Unblock the login flow.
- [x] **Add Reddit source** — expand from 10 PH ideas to 15-20 candidates across PH + Reddit. Claude still picks top 10.
- [ ] **Real Naver DataLab** — replace Claude estimation with actual API data. Add the trend line chart.
- [x] **SEO basics** — sitemap.xml, robots.txt, JSON-LD structured data, OG/Twitter meta tags, Korean keywords.
- [ ] **Disquiet launch post** — first real distribution test.
- [x] **Analytics** — Plausible, track daily visitors and premium conversion.
- [ ] **Stripe integration** — ₩9,900/month. Start collecting revenue.
