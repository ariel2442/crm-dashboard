/**
 * Topbar Component - Page header with title and actions
 */
import { COLORS } from "../../constants/colors.js";
import { PAGE_META } from "../../data/navigation.js";

export default function Topbar({ page }) {
  const getColor = (colorKey) => COLORS[colorKey] || COLORS.text;
  const m = PAGE_META[page] || PAGE_META.overview;
  const mColor = getColor(m.colorKey);

  const hour = new Date().getHours();
  const greet =
    hour < 12 ? "בוקר טוב ☀️" : hour < 17 ? "צהריים טובים" : hour < 21 ? "ערב טוב 🌙" : "לילה טוב";

  return (
    <header
      style={{
        flexShrink: 0,
        padding: "18px 28px",
        background: `linear-gradient(90deg, ${COLORS.panel} 0%, ${COLORS.card}33 100%)`,
        borderBottom: `1.5px solid ${COLORS.border}40`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${mColor}20 0%, ${mColor}08 100%)`,
            border: `1.5px solid ${mColor}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            boxShadow: `0 4px 12px ${mColor}15`,
            backdropFilter: "blur(4px)",
          }}
        >
          {m.icon}
        </div>
        <div>
          <h1
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: COLORS.text,
            }}
          >
            {m.title}
          </h1>
          <p
            style={{
              fontSize: 11,
              color: COLORS.textMuted,
              marginTop: 1,
            }}
          >
            {m.sub}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "rgba(255,255,255,.05)",
              border: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            🔔
          </div>
          <div
            style={{
              position: "absolute",
              top: -3,
              left: -3,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: COLORS.rose,
              color: "#fff",
              fontSize: 9,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${COLORS.panel}`,
            }}
          >
            3
          </div>
        </div>
        <span style={{ fontSize: 12, color: COLORS.textMuted }}>{greet}</span>
      </div>
    </header>
  );
}
