/**
 * Badge Component - Reusable label with color styling
 */
import { COLORS } from "../../constants/colors.js";

export default function Badge({ label, colorKey = "textMuted" }) {
  const color = COLORS[colorKey] || COLORS.textMuted;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 14px",
        borderRadius: 10,
        fontSize: 11,
        fontWeight: 800,
        whiteSpace: "nowrap",
        background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
        color: color,
        border: `1.5px solid ${color}50`,
        boxShadow: `0 4px 12px ${color}18`,
        backdropFilter: "blur(4px)",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        transition: "all 0.2s ease",
      }}
    >
      {label}
    </span>
  );
}
