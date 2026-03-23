const labels = { Easy: "쉬움", Medium: "보통", Hard: "어려움" } as const;
const colors = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
} as const;

export function DifficultyBadge({ difficulty }: { difficulty: "Easy" | "Medium" | "Hard" }) {
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${colors[difficulty]}`}>
      {labels[difficulty]}
    </span>
  );
}
