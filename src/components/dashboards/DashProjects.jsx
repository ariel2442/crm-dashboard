/**
 * DashProjects Component - Project management dashboard
 */
import { COLORS } from "../../constants/colors.js";
import { DEALS, MONTHS } from "../../data/mock-data.js";
import Stat from "../shared/Stat.jsx";
import SectionTitle from "../shared/SectionTitle.jsx";
import MiniBar from "../shared/MiniBar.jsx";

export default function DashProjects() {
  const totalProjects = DEALS.length;
  const activeProjects = DEALS.filter((d) => d.stage !== "נסגר").length;
  const completedProjects = DEALS.filter((d) => d.stage === "נסגר").length;
  const avgProgress = Math.round(
    DEALS.reduce((a, b) => a + (b.prob || 0), 0) / totalProjects
  );

  const projects = [
    { name: "בניית אתר עסקי", progress: 85, colorKey: "cyan", dueDate: "15.4.2026" },
    { name: "מערכת CRM חדשה", progress: 60, colorKey: "emerald", dueDate: "30.4.2026" },
    { name: "אפליקציית מובייל", progress: 45, colorKey: "violet", dueDate: "20.5.2026" },
    { name: "אוטומציה שיווקית", progress: 70, colorKey: "amber", dueDate: "10.4.2026" },
    { name: "מערכת ניתוח נתונים", progress: 30, colorKey: "rose", dueDate: "30.5.2026" },
  ];

  const getColor = (colorKey) => COLORS[colorKey] || COLORS.text;

  return (
    <div className="fu" style={{ padding: 24, overflowY: "auto", height: "100%" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>דשבורד פרוייקטים 🚀</h2>
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>
          ניהול פרוייקטים · התקדמות · לוחות זמנים
        </p>
      </div>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <Stat
          label="סך הפרוייקטים"
          val={totalProjects}
          sub={`${activeProjects} פעילים`}
          icon="📦"
          colorKey="cyan"
          delay={1}
          glow
        />
        <Stat
          label="פרוייקטים פעילים"
          val={activeProjects}
          sub="בתהליך כרגע"
          icon="⚙️"
          colorKey="violet"
          delay={2}
        />
        <Stat
          label="הושלמו"
          val={completedProjects}
          sub={`${((completedProjects / totalProjects) * 100).toFixed(0)}% הושלמו`}
          icon="✅"
          colorKey="emerald"
          delay={3}
        />
        <Stat
          label="התקדמות ממוצעת"
          val={`${avgProgress}%`}
          sub="של כל הפרוייקטים"
          icon="📊"
          colorKey="amber"
          delay={4}
        />
      </div>

      {/* Projects List */}
      <div
        className="fu"
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: 20,
        }}
      >
        <SectionTitle>פרוייקטים פעילים</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {projects.map((proj, i) => (
            <div key={i}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: getColor(proj.colorKey),
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>
                    {proj.name}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: getColor(proj.colorKey),
                      minWidth: 45,
                      textAlign: "right",
                    }}
                  >
                    {proj.progress}%
                  </span>
                  <span style={{ fontSize: 11, color: COLORS.textMuted }}>
                    📅 {proj.dueDate}
                  </span>
                </div>
              </div>
              <MiniBar pct={proj.progress} colorKey={proj.colorKey} h={7} />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Legend */}
      <div
        style={{
          marginTop: 16,
          padding: 12,
          background: COLORS.bgSecondary || "rgba(255,255,255,0.02)",
          borderRadius: 10,
          fontSize: 11,
          color: COLORS.textMuted,
          textAlign: "center",
        }}
      >
        💡 אתה על גבי המسار! כל הפרוייקטים בתוכנית עם התאריכים שנקבעו
      </div>
    </div>
  );
}
