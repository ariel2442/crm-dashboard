/**
 * BarChart Component - Vertical bar chart with labels
 */
import { COLORS } from "../../constants/colors.js";

export default function BarChart({ data, labels, colorKey, h = 90, target }) {
  const color = COLORS[colorKey] || COLORS.cyan;
  const max = Math.max(...data);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          height: h,
        }}
      >
        {data.map((v, i) => {
          const barH = Math.round((v / max) * h);
          const good = target ? v >= target : true;

          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  color: COLORS.textMuted,
                  fontWeight: 600,
                }}
              >
                {v >= 1000 ? Math.round(v / 1000) + "k" : v}
              </span>
              <div
                className="bar"
                style={{
                  "--w": "100%",
                  width: "100%",
                  height: barH,
                  background: good
                    ? `linear-gradient(180deg, ${color} 0%, ${color}77 100%)`
                    : `linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.06))`,
                  borderRadius: "6px 6px 0 0",
                  boxShadow: good ? `0 4px 12px ${color}30` : "none",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "brightness(1.15)";
                  e.currentTarget.style.boxShadow = good ? `0 8px 20px ${color}50` : "none";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                  e.currentTarget.style.boxShadow = good ? `0 4px 12px ${color}30` : "none";
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", marginTop: 4 }}>
        {labels.map((l, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 9,
              color: COLORS.textMuted,
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
