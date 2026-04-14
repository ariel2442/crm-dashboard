/**
 * DashOverview Component - Main summary dashboard
 */
import { COLORS } from "../../constants/colors.js";
import {
  TXNS,
  DEALS,
  LEADS,
  MONTHS,
  REV,
  EXPENSES,
  TASKS,
  MEETINGS,
  LEADS_M,
  CONV_R,
  CHANNELS,
} from "../../data/mock-data.js";
import Stat from "../shared/Stat.jsx";
import SectionTitle from "../shared/SectionTitle.jsx";
import MiniBar from "../shared/MiniBar.jsx";
import TaskCard from "../shared/TaskCard.jsx";
import BarChart from "../shared/BarChart.jsx";
import DonutChart from "../shared/DonutChart.jsx";
import { formatCurrency } from "../../utils/helpers.js";

export default function DashOverview() {
  const income = TXNS.filter((t) => t.type === "הכנסה").reduce(
    (a, b) => a + b.amt,
    0
  );
  const expenses = TXNS.filter((t) => t.type === "הוצאה").reduce(
    (a, b) => a + b.amt,
    0
  );
  const profit = income - expenses;
  const pipeline = DEALS.reduce((a, b) => a + b.val, 0);
  const weighted = DEALS.reduce((a, b) => a + b.val * (b.prob / 100), 0);

  const getColor = (colorKey) => COLORS[colorKey] || COLORS.text;
  const closingMeetings = MEETINGS.filter((m) => m.status === "קרובה");
  const highPriorityTasks = TASKS.filter((t) => t.priority === "high");

  // Prepare data for charts
  const revenueData = REV;
  const expensesData = EXPENSES;
  
  // Create expense segments for donut
  const expenseSegments = [
    { pct: 35, color: COLORS.rose, label: "שכר עסקי" },
    { pct: 25, color: COLORS.cyan, label: "שיווק" },
    { pct: 20, color: COLORS.amber, label: "טכנולוגיה" },
    { pct: 20, color: COLORS.violet, label: "אחר" },
  ];

  // Marketing summary
  const totalLeads = LEADS.length;
  const leadsTrend = Math.round(LEADS_M.reduce((a, b) => a + b) / LEADS_M.length);
  const conversionRate = Math.round(
    CONV_R.reduce((a, b) => a + b) / CONV_R.length
  );

  // Sales summary
  const totalDeals = DEALS.length;
  const activeDeals = DEALS.filter((d) => d.stage !== "נסגר").length;
  const closingRate = 42; // from DashSales

  // Projects summary
  const projects = [
    { name: "בניית אתר עסקי", progress: 85, colorKey: "cyan" },
    { name: "מערכת CRM חדשה", progress: 60, colorKey: "emerald" },
    { name: "אפליקציית מובייל", progress: 45, colorKey: "violet" },
    { name: "אוטומציה שיווקית", progress: 70, colorKey: "amber" },
    { name: "מערכת ניתוח נתונים", progress: 30, colorKey: "rose" },
  ];
  const totalProjects = projects.length;
  const avgProgress = Math.round(
    projects.reduce((a, b) => a + b.progress, 0) / projects.length
  );

  return (
    <div className="fu" style={{ padding: 24, overflowY: "auto", height: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>דשבורד כללי 📊</h2>
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>
          הכנסות · הוצאות · ביצועים וקצב גדילה
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
          label="הכנסות"
          val={formatCurrency(income)}
          sub="↑ 18% משנה שעברה"
          icon="📈"
          colorKey="emerald"
          delay={1}
          glow
        />
        <Stat
          label="הוצאות"
          val={formatCurrency(expenses)}
          sub="בתקציב המתוכנן"
          icon="💸"
          colorKey="rose"
          delay={2}
        />
        <Stat
          label="רווח נקי"
          val={formatCurrency(profit)}
          sub={`${Math.round((profit / income) * 100)}% מרג׳ין`}
          icon="💰"
          colorKey="cyan"
          delay={3}
        />
        <Stat
          label="פייפליין פתוח"
          val={formatCurrency(pipeline)}
          sub={`${DEALS.length} עסקאות`}
          icon="🎯"
          colorKey="violet"
          delay={4}
        />
      </div>

      {/* Main Grid - Charts and Tasks */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2.2fr 1fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        {/* Revenue Chart */}
        <div
          className="fu s2"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <SectionTitle sub="6 חודשים">הכנסות לאורך זמן</SectionTitle>
          <BarChart
            data={revenueData}
            labels={MONTHS}
            colorKey="emerald"
            h={110}
          />
          <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12 }}>
            <span style={{ color: COLORS.emerald }}>
              📊 ממוצע:{" "}
              {formatCurrency(
                Math.round(revenueData.reduce((a, b) => a + b) / revenueData.length)
              )}
              /חודש
            </span>
            <span style={{ color: COLORS.cyan, marginRight: "auto" }}>
              🏆 שיא: {formatCurrency(Math.max(...revenueData))}
            </span>
          </div>
        </div>

        {/* Tasks Sidebar */}
        <div
          className="fu s3"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <SectionTitle>
            משימות{" "}
            <span style={{ fontSize: 12, color: COLORS.rose }}>
              ({highPriorityTasks.length})
            </span>
          </SectionTitle>
          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {TASKS.slice(0, 4).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>

      {/* Expenses and Meetings Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr 1.1fr",
          gap: 14,
        }}
      >
        {/* Expenses Distribution */}
        <div
          className="fu s4"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <SectionTitle>חלוקת הוצאות</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <DonutChart segments={expenseSegments} size={100} />
            <div style={{ flex: 1 }}>
              {expenseSegments.map((seg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 8,
                    fontSize: 11,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: seg.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: COLORS.textSub }}>{seg.label}</span>
                  <span
                    style={{
                      color: seg.color,
                      fontWeight: 700,
                      marginRight: "auto",
                    }}
                  >
                    {seg.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expenses Chart */}
        <div
          className="fu s5"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <SectionTitle sub="6 חודשים">הוצאות לאורך זמן</SectionTitle>
          <BarChart
            data={expensesData}
            labels={MONTHS}
            colorKey="rose"
            h={100}
          />
          <div
            style={{
              marginTop: 10,
              padding: "7px 10px",
              background: COLORS.roseDim || "rgba(244, 63, 94, 0.1)",
              borderRadius: 8,
              fontSize: 12,
              color: COLORS.rose,
              fontWeight: 700,
            }}
          >
            💡 סך הוצאות: {formatCurrency(expenses)}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div
          className="fu s6"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <SectionTitle>📅 פגישות קרובות</SectionTitle>
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {closingMeetings.length > 0 ? (
              closingMeetings.map((meeting, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "10px 0",
                    borderBottom: `1px solid ${COLORS.border}`,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: getColor(meeting.colorKey),
                        }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>
                        {meeting.title}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      fontSize: 10,
                      color: COLORS.textMuted,
                    }}
                  >
                    <span>⏰ {meeting.time}</span>
                    <span>·</span>
                    <span>📍 {meeting.location}</span>
                  </div>
                  <p style={{ fontSize: 9, color: COLORS.textMuted, marginTop: 4 }}>
                    {meeting.date}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: COLORS.textMuted, fontSize: 11, textAlign: "center", padding: 20 }}>
                אין פגישות קרובות
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summaries Section */}
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: COLORS.text, marginBottom: 14 }}>
          📈 סיכום הדשבורדים
        </h3>
        
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 14,
          }}
        >
          {/* Marketing Summary */}
          <div
            className="fu"
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 18,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 2 }}>
                📣 שיווק
              </h4>
              <p style={{ fontSize: 11, color: COLORS.textMuted }}>
                לידים · המרות
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: COLORS.textSub }}>סכום לידים</span>
                  <span style={{ color: COLORS.cyan, fontWeight: 700 }}>
                    {totalLeads}
                  </span>
                </div>
                <MiniBar pct={Math.min(Math.round((totalLeads / 50) * 100), 100)} colorKey="cyan" h={6} />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: COLORS.textSub }}>ממוצע ליד/חודש</span>
                  <span style={{ color: COLORS.emerald, fontWeight: 700 }}>
                    {leadsTrend}
                  </span>
                </div>
                <MiniBar pct={Math.min(Math.round((leadsTrend / 50) * 100), 100)} colorKey="emerald" h={6} />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: COLORS.textSub }}>שיעור המרה</span>
                  <span style={{ color: COLORS.violet, fontWeight: 700 }}>
                    {conversionRate}%
                  </span>
                </div>
                <MiniBar pct={conversionRate} colorKey="violet" h={6} />
              </div>
            </div>
          </div>

          {/* Sales Summary */}
          <div
            className="fu"
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 18,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 2 }}>
                💼 מכירות
              </h4>
              <p style={{ fontSize: 11, color: COLORS.textMuted }}>
                עסקאות · פייפליין
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: COLORS.textSub }}>סה״כ עסקאות</span>
                  <span style={{ color: COLORS.violet, fontWeight: 700 }}>
                    {totalDeals}
                  </span>
                </div>
                <MiniBar pct={Math.min(Math.round((totalDeals / 15) * 100), 100)} colorKey="violet" h={6} />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: COLORS.textSub }}>עסקאות פעילות</span>
                  <span style={{ color: COLORS.cyan, fontWeight: 700 }}>
                    {activeDeals}
                  </span>
                </div>
                <MiniBar pct={Math.round((activeDeals / totalDeals) * 100)} colorKey="cyan" h={6} />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: COLORS.textSub }}>שיעור סגירה</span>
                  <span style={{ color: COLORS.emerald, fontWeight: 700 }}>
                    {closingRate}%
                  </span>
                </div>
                <MiniBar pct={closingRate} colorKey="emerald" h={6} />
              </div>
            </div>
          </div>

          {/* Projects Summary */}
          <div
            className="fu"
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 18,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 2 }}>
                🚀 פרוייקטים
              </h4>
              <p style={{ fontSize: 11, color: COLORS.textMuted }}>
                ניהול · התקדמות
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: COLORS.textSub }}>סה״כ פרוייקטים</span>
                  <span style={{ color: COLORS.amber, fontWeight: 700 }}>
                    {totalProjects}
                  </span>
                </div>
                <MiniBar pct={100} colorKey="amber" h={6} />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: COLORS.textSub }}>התקדמות ממוצעת</span>
                  <span style={{ color: COLORS.emerald, fontWeight: 700 }}>
                    {avgProgress}%
                  </span>
                </div>
                <MiniBar pct={avgProgress} colorKey="emerald" h={6} />
              </div>
              <div style={{ marginTop: 4, padding: 8, background: COLORS.bgSecondary || "rgba(255,255,255,0.02)", borderRadius: 6 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {projects.slice(0, 2).map((proj, i) => (
                    <div key={i} style={{ fontSize: 10, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: COLORS.textMuted }}>{proj.name}</span>
                      <span style={{ color: getColor(proj.colorKey), fontWeight: 600 }}>
                        {proj.progress}%
                      </span>
                    </div>
                  ))}
                  <div style={{ fontSize: 9, color: COLORS.textMuted, marginTop: 2, paddingTop: 4, borderTop: `1px solid ${COLORS.border}` }}>
                    {projects.length - 2} פרוייקטים נוספים
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
