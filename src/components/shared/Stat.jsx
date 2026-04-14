/**
 * Stat Component - Key performance indicator card
 */
import { COLORS } from "../../constants/colors.js";

export default function Stat({
  label,
  val,
  sub,
  icon,
  colorKey,
  delay = 0,
  glow = false,
}) {
  const color = COLORS[colorKey] || COLORS.cyan;

  return (
    <div
      className={`fu hov s${delay}`}
      style={{
        background: `linear-gradient(135deg, ${color}08 0%, ${COLORS.card} 100%)`,
        border: `1.5px solid ${color}40`,
        borderRadius: 16,
        padding: "22px 24px",
        boxShadow: `0 12px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)`,
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        backdropFilter: "blur(8px)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 20px 48px ${color}30, inset 0 1px 0 rgba(255,255,255,0.1)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = `${color}40`;
        e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)`;
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              color: COLORS.textMuted,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.7,
              marginBottom: 8,
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: color,
              lineHeight: 1,
            }}
          >
            {val}
          </p>
          {sub && (
            <p style={{ fontSize: 12, color: COLORS.textSub, marginTop: 6 }}>
              {sub}
            </p>
          )}
        </div>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: color + "18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
