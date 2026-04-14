/**
 * TaskCard Component - Individual task in task board
 */
import { COLORS } from "../../constants/colors.js";

export default function TaskCard({ task }) {
  const getColor = (colorKey) => COLORS[colorKey] || COLORS.text;
  const priorityColor = {
    high: COLORS.rose,
    medium: COLORS.amber,
    low: COLORS.cyan,
  }[task.priority] || COLORS.textMuted;

  const statusColor = {
    "בתהליך": COLORS.amber,
    "חכה": COLORS.violet,
    "רגיל": COLORS.cyan,
    "בוצע": COLORS.emerald,
  }[task.status] || COLORS.textMuted;

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${statusColor}08 0%, ${COLORS.card} 100%)`,
        border: `1.5px solid ${statusColor}40`,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        cursor: "pointer",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        backdropFilter: "blur(6px)",
      }}
      className="hov"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 16px 32px ${statusColor}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: 8,
        }}
      >
        <div style={{ flex: 1 }}>
          <h4
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: COLORS.text,
              marginBottom: 4,
            }}
          >
            {task.title}
          </h4>
          <p style={{ fontSize: 11, color: COLORS.textMuted }}>
            {task.department}
          </p>
        </div>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: priorityColor + "22",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 700,
            color: priorityColor,
            flexShrink: 0,
          }}
        >
          {task.priority === "high" ? "!" : task.priority === "medium" ? "-" : "°"}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <span
          style={{
            fontSize: 10,
            padding: "2px 8px",
            borderRadius: 6,
            background: statusColor + "22",
            color: statusColor,
            fontWeight: 600,
          }}
        >
          {task.status}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: COLORS.textMuted,
        }}
      >
        <span>{task.assignee}</span>
        <span>{task.dueDate}</span>
      </div>
    </div>
  );
}
