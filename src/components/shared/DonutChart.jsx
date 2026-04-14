/**
 * DonutChart Component - SVG-based donut chart with premium effects
 */
export default function DonutChart({ segments, size = 110 }) {
  let offset = 0;
  const r = 38;
  const circ = 2 * Math.PI * r;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100"
      style={{
        filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))",
      }}
    >
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,.08)"
        strokeWidth="14"
      />
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circ;
        const gap = circ - dash;

        const el = (
          <circle
            key={i}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="14"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 50 50)"
            style={{ 
              transition: "stroke-dasharray 1s ease, filter 0.3s ease",
              filter: `drop-shadow(0 4px 12px ${seg.color}30)`,
            }}
          />
        );

        offset += dash;
        return el;
      })}
    </svg>
  );
}
