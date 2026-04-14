/**
 * SectionTitle Component - Section header with optional subtitle
 */
import { COLORS } from "../../constants/colors.js";

export default function SectionTitle({ children, sub }) {
  return (
    <div
      style={{
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h3
          style={{
            fontWeight: 900,
            fontSize: 16,
            color: COLORS.text,
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {children}
        </h3>
        {sub && (
          <span style={{
            fontSize: 12,
            color: COLORS.textMuted,
            fontWeight: 700,
            background: `${COLORS.border}40`,
            padding: "4px 10px",
            borderRadius: 8,
            backdropFilter: "blur(4px)",
          }}>
            {sub}
          </span>
        )}
      </div>
      <div style={{
        height: "2px",
        background: `linear-gradient(90deg, ${COLORS.violet} 0%, ${COLORS.cyan} 100%)`,
        borderRadius: "1px",
        width: "36px",
      }} />
    </div>
  );
}
