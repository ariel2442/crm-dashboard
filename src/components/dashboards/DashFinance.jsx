/**
 * DashFinance Component - Financial metrics dashboard
 */
import { COLORS } from "../../constants/colors.js";
import { TXNS, MONTHS, REV, EXPENSES } from "../../data/mock-data.js";
import Stat from "../shared/Stat.jsx";
import SectionTitle from "../shared/SectionTitle.jsx";
import Badge from "../shared/Badge.jsx";
import BarChart from "../shared/BarChart.jsx";
import DonutChart from "../shared/DonutChart.jsx";
import MiniBar from "../shared/MiniBar.jsx";
import { formatCurrency } from "../../utils/helpers.js";

export default function DashFinance() {
  const income = TXNS.filter((t) => t.type === "הכנסה").reduce(
    (a, b) => a + b.amt,
    0
  );
  const expenses = TXNS.filter((t) => t.type === "הוצאה").reduce(
    (a, b) => a + b.amt,
    0
  );
  const profit = income - expenses;
  const pending = TXNS.filter((t) => !t.paid && t.type === "הכנסה").reduce(
    (a, b) => a + b.amt,
    0
  );

  const expCats = [
    { cat: "תפעול", amt: 6200, colorKey: "rose" },
    { cat: "שיווק", amt: 4500, colorKey: "violet" },
    { cat: "תוכנה", amt: 980, colorKey: "amber" },
  ];
  const totalExp = expCats.reduce((a, b) => a + b.amt, 0);

  const getColor = (colorKey) => COLORS[colorKey] || COLORS.text;

  const expCatSegments = expCats.map((e) => ({
    pct: Math.round((e.amt / totalExp) * 100),
    color: getColor(e.colorKey),
  }));

  return (
    <div className="fu" style={{ padding: 24, overflowY: "auto", height: "100%" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>דשבורד פיננסי 💰</h2>
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>
          הכנסות · הוצאות · רווחיות · תזרים
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
          label="הכנסות מרץ"
          val={formatCurrency(income)}
          sub="↑ 32% מפבר׳"
          icon="📈"
          colorKey="emerald"
          delay={1}
          glow
        />
        <Stat
          label="הוצאות מרץ"
          val={formatCurrency(expenses)}
          sub={`${Math.round((expenses / income) * 100)}% מההכנסות`}
          icon="📉"
          colorKey="rose"
          delay={2}
        />
        <Stat
          label="רווח נקי"
          val={formatCurrency(profit)}
          sub={`מרג׳ין ${Math.round((profit / income) * 100)}%`}
          icon="💎"
          colorKey="cyan"
          delay={3}
        />
        <Stat
          label="ממתין לגבייה"
          val={formatCurrency(pending)}
          sub="2 חשבוניות פתוחות"
          icon="⏳"
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
        {/* Cash Flow Chart */}
        <div
          className="fu s2"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <SectionTitle sub="6 חודשים">תזרים מזומנים</SectionTitle>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 6,
              height: 110,
              marginBottom: 6,
            }}
          >
            {REV.map((v, i) => {
              const max = Math.max(...REV);
              const net = v - EXPENSES[i];
              const revH = Math.round((v / max) * 100);
              const expH = Math.round((EXPENSES[i] / max) * 100);

              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <span style={{ fontSize: 9, color: COLORS.textMuted }}>
                    {Math.round(net / 1000)}k
                  </span>
                  <div
                    style={{
                      width: "100%",
                      position: "relative",
                      height: 100,
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 2,
                    }}
                  >
                    <div
                      className="bar"
                      style={{
                        "--w": "100%",
                        flex: 1,
                        height: revH,
                        background: `linear-gradient(180deg,${COLORS.emerald},${COLORS.emerald}66)`,
                        borderRadius: "3px 3px 0 0",
                      }}
                    />
                    <div
                      className="bar"
                      style={{
                        "--w": "100%",
                        flex: 1,
                        height: expH,
                        background: `linear-gradient(180deg,${COLORS.rose}88,${COLORS.rose}33)`,
                        borderRadius: "3px 3px 0 0",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", marginBottom: 10 }}>
            {MONTHS.map((m, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 9,
                  color: COLORS.textMuted,
                }}
              >
                {m}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 11 }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: COLORS.emerald,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: COLORS.emerald,
                  display: "inline-block",
                }}
              />
              הכנסות
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: COLORS.rose,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: COLORS.rose,
                  display: "inline-block",
                }}
              />
              הוצאות
            </span>
            <span
              style={{
                marginRight: "auto",
                color: COLORS.cyan,
                fontWeight: 700,
              }}
            >
              רווח מרץ: {formatCurrency(REV[5] - EXPENSES[5])}
            </span>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div
          className="fu s3"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <SectionTitle>פילוח הוצאות</SectionTitle>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 16,
            }}
          >
            <DonutChart segments={expCatSegments} size={100} />
            <div style={{ flex: 1 }}>
              {expCats.map((e, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      marginBottom: 3,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 2,
                          background: getColor(e.colorKey),
                        }}
                      />
                      <span style={{ color: COLORS.textSub }}>{e.cat}</span>
                    </div>
                    <span
                      style={{
                        color: getColor(e.colorKey),
                        fontWeight: 700,
                      }}
                    >
                      {formatCurrency(e.amt)}
                    </span>
                  </div>
                  <MiniBar
                    pct={Math.round((e.amt / totalExp) * 100)}
                    colorKey={e.colorKey}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              padding: "8px 12px",
              background: COLORS.roseDim,
              borderRadius: 8,
              fontSize: 12,
              color: COLORS.rose,
            }}
          >
            💡 הוצאות = {Math.round((expenses / income) * 100)}% מהכנסות —
            יעד: מתחת ל-40%
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        {/* Transactions */}
        <div
          className="fu s4"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <SectionTitle>תנועות אחרונות</SectionTitle>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["סוג", "תיאור", "סכום", "תאריך", "סטטוס"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "6px 8px",
                      textAlign: "right",
                      fontSize: 10,
                      color: COLORS.textMuted,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TXNS.map((t, i) => (
                <tr
                  key={t.id}
                  className="row"
                  style={{
                    borderBottom:
                      i < TXNS.length - 1 ? `1px solid ${COLORS.border}` : "none",
                  }}
                >
                  <td style={{ padding: "9px 8px" }}>
                    <Badge
                      label={t.type}
                      colorKey={t.type === "הכנסה" ? "emerald" : "rose"}
                    />
                  </td>
                  <td
                    style={{
                      padding: "9px 8px",
                      fontSize: 12,
                      maxWidth: 140,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.desc}
                  </td>
                  <td
                    style={{
                      padding: "9px 8px",
                      fontWeight: 700,
                      fontSize: 13,
                      color:
                        t.type === "הכנסה"
                          ? COLORS.emerald
                          : COLORS.rose,
                    }}
                  >
                    {t.type === "הוצאה" ? "-" : "+"}
                    {formatCurrency(t.amt)}
                  </td>
                  <td
                    style={{
                      padding: "9px 8px",
                      fontSize: 11,
                      color: COLORS.textMuted,
                    }}
                  >
                    {t.date}
                  </td>
                  <td style={{ padding: "9px 8px" }}>
                    <Badge
                      label={t.paid ? "שולם" : "ממתין"}
                      colorKey={t.paid ? "emerald" : "amber"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Profit Margin Trend */}
        <div
          className="fu s5"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <SectionTitle>מרג׳ין רווח לאורך זמן</SectionTitle>
          <BarChart
            data={REV.map((v, i) => Math.round(((v - EXPENSES[i]) / v) * 100))}
            labels={MONTHS}
            colorKey="cyan"
            h={100}
            target={55}
          />
          <div
            style={{
              marginTop: 10,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {[
              {
                l: "מרג׳ין ממוצע",
                v:
                  Math.round(
                    REV.map((v, i) => ((v - EXPENSES[i]) / v) * 100).reduce(
                      (a, b) => a + b
                    ) / REV.length
                  ) + "%",
                colorKey: "cyan",
              },
              {
                l: "מרג׳ין מרץ",
                v: Math.round(((REV[5] - EXPENSES[5]) / REV[5]) * 100) + "%",
                colorKey: "emerald",
              },
              { l: "יעד מרג׳ין", v: "60%", colorKey: "textMuted" },
              {
                l: "הכנסות YTD",
                v: formatCurrency(REV.reduce((a, b) => a + b)),
                colorKey: "emerald",
              },
            ].map((m, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,.04)",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}
              >
                <p style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 3 }}>
                  {m.l}
                </p>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: getColor(m.colorKey),
                  }}
                >
                  {m.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
