import type { NaverTrendPoint } from "@/lib/schema";

const CHART_W = 560;
const CHART_H = 160;
const PAD = { top: 10, right: 10, bottom: 28, left: 36 };
const INNER_W = CHART_W - PAD.left - PAD.right;
const INNER_H = CHART_H - PAD.top - PAD.bottom;

/**
 * SVG line chart showing 12-month Naver search trend data.
 * Pure server component — no client JS.
 */
export function TrendChart({ data }: { data: NaverTrendPoint[] }) {
  if (data.length < 2) return null;

  const maxRatio = Math.max(...data.map((d) => d.ratio), 10);
  const minRatio = Math.min(...data.map((d) => d.ratio), 0);
  const range = maxRatio - minRatio || 1;

  const points = data.map((d, i) => {
    const x = PAD.left + (i / (data.length - 1)) * INNER_W;
    const y = PAD.top + INNER_H - ((d.ratio - minRatio) / range) * INNER_H;
    return { x, y, ...d };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD.top + INNER_H} L ${points[0].x} ${PAD.top + INNER_H} Z`;

  // Show abbreviated month labels
  const labels = points.filter((_, i) => i % 2 === 0 || i === points.length - 1);

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full h-auto"
        aria-label="네이버 검색 트렌드 차트"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = PAD.top + INNER_H * (1 - pct);
          const val = Math.round(minRatio + range * pct);
          return (
            <g key={pct}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + INNER_W}
                y2={y}
                stroke="currentColor"
                className="text-zinc-200 dark:text-zinc-700"
                strokeWidth={0.5}
              />
              <text
                x={PAD.left - 6}
                y={y + 3}
                textAnchor="end"
                className="text-zinc-400 dark:text-zinc-500"
                fontSize={9}
                fill="currentColor"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#trendGradient)" opacity={0.2} />

        {/* Gradient def */}
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#2563EB"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p) => (
          <circle
            key={p.period}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="#2563EB"
            stroke="white"
            strokeWidth={1.5}
            className="dark:stroke-zinc-900"
          />
        ))}

        {/* X-axis labels */}
        {labels.map((p) => {
          const month = p.period.slice(5, 7).replace(/^0/, "");
          const year = p.period.slice(2, 4);
          return (
            <text
              key={p.period}
              x={p.x}
              y={CHART_H - 4}
              textAnchor="middle"
              className="text-zinc-400 dark:text-zinc-500"
              fontSize={9}
              fill="currentColor"
            >
              {month}월 '{year}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
