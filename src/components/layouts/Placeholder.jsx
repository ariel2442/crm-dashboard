/**
 * Placeholder Component - Shows for pages under development
 */
import { COLORS } from "../../constants/colors.js";
import { PAGE_META } from "../../data/navigation.js";

export default function Placeholder({ page }) {
  const getColor = (colorKey) => COLORS[colorKey] || COLORS.text;
  const m = PAGE_META[page] || PAGE_META.overview;
  const mColor = getColor(m.colorKey);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 20,
        background: `radial-gradient(circle at center, ${mColor}08 0%, transparent 70%)`,
      }}
    >
      <div style={{
        fontSize: 72,
        animation: "pulse 2s ease-in-out infinite",
      }}>
        {m.icon}
      </div>
      <h2 style={{
        fontSize: 24,
        fontWeight: 900,
        color: COLORS.text,
        textAlign: "center",
      }}>
        {m.title}
      </h2>
      <p style={{
        fontSize: 14,
        color: COLORS.textMuted,
        textAlign: "center",
        maxWidth: 280,
      }}>
        מודול זה בפיתוח
      </p>
      <span
        style={{
          padding: "10px 24px",
          borderRadius: 12,
          background: `linear-gradient(135deg, ${mColor}15 0%, ${mColor}08 100%)`,
          color: mColor,
          fontWeight: 800,
          fontSize: 13,
          border: `1.5px solid ${mColor}50`,
          boxShadow: `0 4px 12px ${mColor}20`,
          backdropFilter: "blur(4px)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = `0 8px 20px ${mColor}30`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = `0 4px 12px ${mColor}20`;
        }}
      >
        בקרוב ✨
      </span>
    </div>
  );
}
