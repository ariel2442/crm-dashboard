/**
 * DashMarketing Component - Marketing metrics dashboard
 */
import { COLORS } from "../../constants/colors.js";
import { MONTHS, LEADS_M, CONV_R, CHANNELS } from "../../data/mock-data.js";
import Stat from "../shared/Stat.jsx";
import SectionTitle from "../shared/SectionTitle.jsx";
import BarChart from "../shared/BarChart.jsx";
import DonutChart from "../shared/DonutChart.jsx";
import MiniBar from "../shared/MiniBar.jsx";

export default function DashMarketing() {
  const getColor = (colorKey) => COLORS[colorKey] || COLORS.text;

  const channelSegments = CHANNELS.map((ch) => ({
    pct: ch.pct,
    color: getColor(ch.colorKey),
  }));

  return (
    <div className="fu" style={{ padding: 24, overflowY: "auto", height: "100%" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>דשבורד שיווק 📣</h2>
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>
          מקורות לידים · המרות · ביצועי ערוצים
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
          label="לידים החודש"
          val="38"
          sub="↑ 41% מחודש שעבר"
          icon="◎"
          colorKey="cyan"
          delay={1}
        />
        <Stat
          label="שיעור המרה"
          val="42%"
          sub="↑ 7% מחודש שעבר"
          icon="🎯"
          colorKey="emerald"
          delay={2}
          glow
        />
        <Stat
          label="עלות ליד"
          val="₪118"
          sub="↓ טוב מהיעד (₪150)"
          icon="💸"
          colorKey="violet"
          delay={3}
        />
        <Stat
          label="ROI שיווקי"
          val="340%"
          sub="על בסיס השקעה חודשית"
          icon="📈"
          colorKey="amber"
          delay={4}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        {/* Leads Over Time */}
        <div
          className="fu s2"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <SectionTitle sub="6 חודשים">לידים לאורך זמן</SectionTitle>
          <BarChart
            data={LEADS_M}
            labels={MONTHS}
            colorKey="cyan"
            h={100}
          />
          <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12 }}>
            <span style={{ color: COLORS.cyan }}>
              📊 ממוצע:{" "}
              {Math.round(LEADS_M.reduce((a, b) => a + b) / LEADS_M.length)}{" "}
              לידים/חודש
            </span>
            <span style={{ color: COLORS.emerald, marginRight: "auto" }}>
              🏆 שיא: {Math.max(...LEADS_M)} לידים
            </span>
          </div>
        </div>

        {/* Channels Donut */}
        <div
          className="fu s3"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <SectionTitle>מקורות לידים</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <DonutChart segments={channelSegments} size={110} />
            <div style={{ flex: 1 }}>
              {CHANNELS.map((ch, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: getColor(ch.colorKey),
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 12, color: COLORS.textSub }}>
                      {ch.name}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: getColor(ch.colorKey),
                      }}
                    >
                      {ch.pct}%
                    </span>
                    <span style={{ fontSize: 11, color: COLORS.textMuted }}>
                      {ch.leads}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 14,
        }}
      >
        {/* Conversion Funnel */}
        <div
          className="fu s4"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <SectionTitle>משפך המרות</SectionTitle>
          {[
            { label: "מבקרים באתר", n: 1240, colorKey: "textMuted" },
            { label: "יצרו קשר", n: 186, colorKey: "cyan" },
            { label: "שיחת גילוי", n: 94, colorKey: "violet" },
            { label: "הצעת מחיר", n: 52, colorKey: "amber" },
            { label: "לקוח סגור", n: 16, colorKey: "emerald" },
          ].map((f, i, arr) => {
            const pct = Math.round((f.n / arr[0].n) * 100);
            return (
              <div key={i} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: COLORS.textSub }}>{f.label}</span>
                  <span
                    style={{
                      color: getColor(f.colorKey),
                      fontWeight: 700,
                    }}
                  >
                    {f.n.toLocaleString()}
                  </span>
                </div>
                <MiniBar pct={pct} colorKey={f.colorKey} h={6} />
              </div>
            );
          })}
        </div>

        {/* Conversion Rate Chart */}
        <div
          className="fu s5"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <SectionTitle>שיעור המרה %</SectionTitle>
          <BarChart
            data={CONV_R}
            labels={MONTHS}
            colorKey="emerald"
            h={90}
            target={30}
          />
          <div
            style={{
              marginTop: 10,
              padding: "7px 10px",
              background: COLORS.emeraldDim,
              borderRadius: 8,
              fontSize: 12,
              color: COLORS.emerald,
              fontWeight: 700,
            }}
          >
            📈 מרץ — שיא של {Math.max(...CONV_R)}% המרה!
          </div>
        </div>

        {/* Active Campaigns */}
        <div
          className="fu s6"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <SectionTitle>קמפיינים פעילים</SectionTitle>
          {[
            {
              name: "גוגל Search",
              budget: 3500,
              leads: 12,
              cpl: 292,
              colorKey: "cyan",
            },
            {
              name: "פייסבוק Ads",
              budget: 2000,
              leads: 8,
              cpl: 250,
              colorKey: "violet",
            },
            {
              name: "לינקדאין",
              budget: 1500,
              leads: 14,
              cpl: 107,
              colorKey: "emerald",
            },
            {
              name: "תוכן אורגני",
              budget: 0,
              leads: 4,
              cpl: 0,
              colorKey: "amber",
            },
          ].map((camp, i) => (
            <div
              key={i}
              style={{
                padding: "10px 0",
                borderBottom: `1px solid ${COLORS.border}`,
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
                      background: getColor(camp.colorKey),
                      animation: i === 0 ? "pulse 2s infinite" : "none",
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {camp.name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: COLORS.emerald,
                    fontWeight: 700,
                  }}
                >
                  {camp.leads} לידים
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  fontSize: 11,
                  color: COLORS.textMuted,
                }}
              >
                <span>
                  תקציב:{" "}
                  {camp.budget
                    ? "₪" + camp.budget.toLocaleString("he-IL")
                    : "אורגני"}
                </span>
                {camp.cpl > 0 && (
                  <span>
                    עלות/ליד: ₪{camp.cpl.toLocaleString("he-IL")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
