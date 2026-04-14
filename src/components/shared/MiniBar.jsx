/**
 * MiniBar Component - Horizontal progress bar with gradient
 */
import { COLORS } from "../../constants/colors.js";

export default function MiniBar({ pct, colorKey, h = 5 }) {
  const color = COLORS[colorKey] || COLORS.cyan;

  return (
    <div
      style={{
        height: h,
        background: `linear-gradient(90deg, ${COLORS.border}60 0%, ${COLORS.border}20 100%)`,
        borderRadius: h,
        overflow: "hidden",
        boxShadow: `0 2px 6px rgba(0,0,0,0.1)`,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="bar"
        style={{
          "--w": pct + "%",
          height: "100%",
          background: `linear-gradient(90deg, ${color} 0%, ${color}77 100%)`,
          borderRadius: h,
          boxShadow: `0 0 12px ${color}40`,
          transition: "all 0.4s ease",
        }}
      />
    </div>
  );
}
