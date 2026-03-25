const SOURCE_CONFIG = {
  producthunt: { label: "PH", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  reddit: { label: "Reddit", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
} as const;

export function SourceBadge({ source }: { source: string }) {
  const config = SOURCE_CONFIG[source as keyof typeof SOURCE_CONFIG];
  if (!config) return null;

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${config.className}`}>
      {config.label}
    </span>
  );
}
