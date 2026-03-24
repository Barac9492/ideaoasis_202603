export const CATEGORIES = [
  { id: "fintech", label: "핀테크", emoji: "💰" },
  { id: "healthtech", label: "헬스케어", emoji: "🏥" },
  { id: "edtech", label: "교육", emoji: "📚" },
  { id: "ecommerce", label: "이커머스", emoji: "🛒" },
  { id: "saas", label: "SaaS/B2B", emoji: "💼" },
  { id: "ai", label: "AI/ML", emoji: "🤖" },
  { id: "social", label: "소셜/커뮤니티", emoji: "👥" },
  { id: "creator", label: "크리에이터", emoji: "🎨" },
  { id: "productivity", label: "생산성", emoji: "⚡" },
  { id: "lifestyle", label: "라이프스타일", emoji: "🌿" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

export function getCategoryLabel(id: string): string {
  const cat = CATEGORIES.find((c) => c.id === id);
  return cat ? `${cat.emoji} ${cat.label}` : id;
}
