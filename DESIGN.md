# Design System — IdeaOasis

## Product Context
- **What this is:** Daily curated startup idea digest with AI-powered Korean market analysis
- **Who it's for:** Korean entrepreneurs looking for global startup ideas to build in Korea
- **Space/industry:** Startup intelligence, editorial curation (closest peers: IdeaBrowser, Disquiet, ProductHunt)
- **Project type:** Editorial web app — a daily briefing, not a dashboard

## Aesthetic Direction
- **Direction:** Editorial/Magazine
- **Decoration level:** Intentional — subtle warmth through background tints and card shadows, but typography does the heavy lifting
- **Mood:** Opening a beautifully curated morning briefing. Authoritative but approachable. Feels like a trusted publication, not a tech tool.
- **Reference sites:** Toss (toss.im), Baemin (baemin.com), Disquiet (disquiet.io)

## Typography
- **Display/Hero (English):** Instrument Serif — editorial gravitas, used for English headlines and taglines. Italic for taglines.
- **Body/Headings (Korean):** Pretendard — the standard Korean web font. Self-hosted, Regular (400) + SemiBold (600) + Bold (700).
- **UI/Labels:** Pretendard SemiBold (600) at 13px
- **Data/Tables:** Pretendard with tabular-nums
- **Code:** JetBrains Mono (if needed)
- **Loading:** Pretendard self-hosted from /fonts/. Instrument Serif from Google Fonts CDN.
- **Scale:**
  - xs: 11px — footnotes, timestamps
  - sm: 13px — labels, metadata, badges
  - base: 15px — body text
  - lg: 18px — card titles, section headings
  - xl: 24px — page headings (Korean)
  - 2xl: 32px — hero headings (Korean)
  - 3xl: 42px — display headings (English, Instrument Serif)
  - 4xl: 48px — hero display (English, Instrument Serif)

## Color
- **Approach:** Restrained — one accent + warm neutrals. Color is rare and meaningful.
- **Accent:** #2563EB (confident blue) — trust, intelligence, authority
- **Accent Hover:** #1D4ED8
- **Background Light:** #FAFAF9 (warm white)
- **Background Dark:** #111111 (deep black)
- **Surface Light:** #FFFFFF
- **Surface Dark:** #1C1C1E
- **Text Light:** #18181B
- **Text Dark:** #FAFAFA
- **Muted Light:** #71717A
- **Muted Dark:** #A1A1AA
- **Border Light:** #F4F4F5
- **Border Dark:** #2C2C2E
- **Semantic:**
  - Success: #16A34A (green)
  - Warning: #CA8A04 (amber)
  - Error: #DC2626 (red)
  - Info: #2563EB (blue, same as accent)
- **Dark mode strategy:** Reduce saturation 10-20% on semantic colors. Use rgba overlays for dark badges/alerts.

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable — generous vertical rhythm befitting an editorial product
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64)
- **Section gaps:** 48-64px between major sections
- **Card padding:** 24px (28px on left when using accent border)

## Layout
- **Approach:** Single-column editorial — narrow, focused, scannable
- **Max content width:** 640px
- **Grid:** Single column, no sidebar (content-focused like a newsletter)
- **Border radius:**
  - sm: 8px — buttons, badges, inputs
  - md: 10px — alerts, small cards
  - lg: 16px — idea cards, content cards
  - full: 9999px — rank badges, pills

## Motion
- **Approach:** Minimal-functional
- **Card hover:** translateY(-2px) + subtle shadow increase, 200ms ease
- **Theme transition:** background-color 300ms, color 300ms
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(100ms) short(200ms) medium(300ms)
- **No scroll animations, no entrance animations, no decorative motion**

## Component Patterns
- **Idea Card:** White/dark surface, left 3px accent border, 16px radius. Rank badge as absolute-positioned circle (28px, accent bg). Hover lifts 2px.
- **Category Badges:** Light blue bg (#EFF6FF / rgba), blue text. Includes emoji prefix.
- **Difficulty Badges:** Green (쉬움), Amber (보통), Red (어려움). Pill shape.
- **Premium Gate:** Blurred cards (blur 3px, opacity 0.4) with centered CTA overlay card.
- **Header:** Sticky, backdrop-blur-12px, 56px height. Logo left, nav + auth right.
- **Footer:** Simple, single line. "매일 아침 5시 업데이트" left, RSS + copyright right.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-24 | Initial design system | Created by /design-consultation. Editorial/magazine aesthetic with blue accent and Instrument Serif. |
| 2026-03-24 | Blue accent (#2563EB) over coral (#FF6B6B) | Blue signals trust and intelligence — fitting for a curated information product. Coral felt like a food delivery app. |
| 2026-03-24 | Instrument Serif for English headlines | Editorial gravitas that differentiates from typical Korean tech products. Serifs signal "publication" over "tool." |
| 2026-03-24 | 640px max-width | Newsletter-like focus. Single column forces content quality — no hiding behind layout complexity. |
