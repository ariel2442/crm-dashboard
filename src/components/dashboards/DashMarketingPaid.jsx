/**
 * DashMarketingPaid - Paid Campaigns Dashboard with Stats & Improvement Tips
 */
import { useState } from "react";
import { COLORS } from "../../constants/colors.js";
import Stat from "../shared/Stat.jsx";
import SectionTitle from "../shared/SectionTitle.jsx";
import MiniBar from "../shared/MiniBar.jsx";
import { formatCurrency } from "../../utils/helpers.js";

const CAMPAIGNS = [
  {
    id: "1",
    name: "גוגל Search — בניית אתרים",
    platform: "גוגל",
    platformIcon: "🔍",
    platformColor: "rose",
    status: "ACTIVE",
    spend: 3500,
    impressions: 24500,
    clicks: 850,
    leads: 12,
    ctr: 3.47,
    costPerClick: 4.12,
    costPerLead: 291,
    roas: 4.2,
    tips: [
      "הוסף מילות מפתח ארוכות זנב כמו 'בניית אתר לעסק קטן בזול'",
      "הוסף Negative Keywords כמו 'חינם', 'דיי', 'תיכון'",
      "שפר את דף הנחיתה — זמן טעינה מעל 3 שניות מוריד המרות",
    ],
    score: 78,
  },
  {
    id: "2",
    name: "פייסבוק — ריטרגטינג",
    platform: "פייסבוק",
    platformIcon: "📘",
    platformColor: "cyan",
    status: "ACTIVE",
    spend: 2200,
    impressions: 18700,
    clicks: 640,
    leads: 9,
    ctr: 3.42,
    costPerClick: 3.44,
    costPerLead: 244,
    roas: 5.1,
    tips: [
      "קהל הריטרגטינג קטן מדי — הרחב ל-60 ימים במקום 30",
      "נסה Lookalike 1% מרשימת הלקוחות שלך",
      "החלף קריאייטיב — הוידאו הנוכחי פעיל מעל 3 שבועות",
    ],
    score: 85,
  },
  {
    id: "3",
    name: "אינסטגרם — Stories לידים",
    platform: "אינסטגרם",
    platformIcon: "📸",
    platformColor: "violet",
    status: "ACTIVE",
    spend: 1800,
    impressions: 31000,
    clicks: 420,
    leads: 7,
    ctr: 1.35,
    costPerClick: 4.29,
    costPerLead: 257,
    roas: 3.1,
    tips: [
      "CTR נמוך (1.35%) — שנה את הטקסט על ה-Story, הוסף CTA ברור",
      "נסה פורמט Reels — ביצועים טובים ב-40% מ-Stories",
      "בדוק קהל: גיל 25-45 עובד טוב יותר בתחום זה",
    ],
    score: 62,
  },
  {
    id: "4",
    name: "לינקדאין — B2B עסקים",
    platform: "לינקדאין",
    platformIcon: "💼",
    platformColor: "cyan",
    status: "PAUSED",
    spend: 1500,
    impressions: 9200,
    clicks: 180,
    leads: 5,
    ctr: 1.96,
    costPerClick: 8.33,
    costPerLead: 300,
    roas: 6.8,
    tips: [
      "ROAS גבוה (6.8) — שווה להחזיר פעיל ולהגדיל תקציב",
      "מחיר/קליק גבוה — נורמלי בלינקדאין, אבל הלידים איכותיים",
      "נסה Lead Gen Form ישירות בלינקדאין, המרה גבוהה יותר",
    ],
    score: 71,
  },
];

const SCORE_COLOR = (s) => {
  if (s >= 80) return COLORS.emerald;
  if (s >= 65) return COLORS.amber;
  return COLORS.rose;
};

export default function DashMarketingPaid() {
  const [selected, setSelected] = useState(CAMPAIGNS[0]);
  const [facebookToken, setFacebookToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalSpend = CAMPAIGNS.reduce((a, b) => a + b.spend, 0);
  const totalImpressions = CAMPAIGNS.reduce((a, b) => a + b.impressions, 0);
  const totalClicks = CAMPAIGNS.reduce((a, b) => a + b.clicks, 0);
  const totalLeads = CAMPAIGNS.reduce((a, b) => a + b.leads, 0);
  const avgCTR = ((totalClicks / totalImpressions) * 100).toFixed(2);
  const avgCPL = Math.round(totalSpend / totalLeads);

  const handleConnect = async () => {
    if (!facebookToken) { alert("אנא הכנס Access Token"); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `https://graph.facebook.com/v18.0/me/campaigns?access_token=${facebookToken}&fields=id,name,status,spend,impressions,clicks`
      );
      if (!res.ok) throw new Error("נכשל בחיבור — בדוק את ה-Token");
      setIsConnected(true);
    } catch (e) {
      alert("שגיאה: " + e.message);
    }
    setLoading(false);
  };

  const getStatusLabel = (s) => ({ ACTIVE: "פעיל", PAUSED: "מושהה" }[s] || "לא פעיל");
  const getStatusColor = (s) => ({ ACTIVE: COLORS.emerald, PAUSED: COLORS.amber }[s] || COLORS.textMuted);

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: 24, direction: "rtl", fontFamily: "'Rubik', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>קמפיינים ממומנים 💳</h2>
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>
          גוגל · פייסבוק · אינסטגרם · לינקדאין — ביצועים והמלצות שיפור
        </p>
      </div>

      {/* Connect Banner */}
      {!isConnected && (
        <div
          style={{
            background: COLORS.violetDim,
            border: `1px solid ${COLORS.violet}40`,
            borderRadius: 14,
            padding: "14px 20px",
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 18 }}>🔗</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>חבר את פייסבוק Ads</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>
              לנתונים אמיתיים — כרגע מוצגים נתוני דוגמה
            </div>
          </div>
          <input
            type="password"
            placeholder="Access Token..."
            value={facebookToken}
            onChange={(e) => setFacebookToken(e.target.value)}
            style={{
              padding: "8px 12px",
              background: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              color: COLORS.text,
              fontSize: 12,
              width: 200,
              direction: "ltr",
            }}
          />
          <button
            onClick={handleConnect}
            disabled={loading}
            style={{
              padding: "8px 20px",
              background: COLORS.violet,
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "מחבר..." : "חבר"}
          </button>
        </div>
      )}

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
        <Stat label="הוצאה כוללת" val={formatCurrency(totalSpend)} sub={`${CAMPAIGNS.length} קמפיינים`} icon="💳" colorKey="violet" delay={1} glow />
        <Stat label="אימפרסיות" val={(totalImpressions / 1000).toFixed(1) + "K"} sub="סך הצפיות" icon="👁️" colorKey="cyan" delay={2} />
        <Stat label="קליקים" val={totalClicks.toLocaleString()} sub={`CTR: ${avgCTR}%`} icon="🖱️" colorKey="emerald" delay={3} />
        <Stat label="לידים" val={totalLeads} sub="מכל הקמפיינים" icon="◎" colorKey="amber" delay={4} />
        <Stat label="עלות/ליד" val={`₪${avgCPL}`} sub="ממוצע כולל" icon="🎯" colorKey="rose" delay={5} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
        {/* Left: Campaign Table + Tips */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Campaigns Table */}
          <div
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "16px 20px 10px", borderBottom: `1px solid ${COLORS.border}` }}>
              <SectionTitle>כל הקמפיינים</SectionTitle>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  {["קמפיין", "סטטוס", "הוצאה", "אימפ.", "קליקים", "CTR", "לידים", "CPL", "ROAS", "ציון"].map((h, i) => (
                    <th key={i} style={{ padding: "10px 14px", textAlign: "right", color: COLORS.textMuted, fontWeight: 600, fontSize: 11, whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CAMPAIGNS.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    style={{
                      borderBottom: `1px solid ${COLORS.border}40`,
                      cursor: "pointer",
                      background: selected?.id === c.id ? COLORS.violetDim : "transparent",
                      transition: "background 0.12s",
                    }}
                  >
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span>{c.platformIcon}</span>
                        <span style={{ fontWeight: 600, color: COLORS.text }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        padding: "3px 9px", borderRadius: 10,
                        background: getStatusColor(c.status) + "18",
                        color: getStatusColor(c.status),
                        fontSize: 11, fontWeight: 600,
                      }}>
                        {getStatusLabel(c.status)}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", color: COLORS.text, fontWeight: 600 }}>{formatCurrency(c.spend)}</td>
                    <td style={{ padding: "12px 14px", color: COLORS.textMuted }}>{(c.impressions / 1000).toFixed(1)}K</td>
                    <td style={{ padding: "12px 14px", color: COLORS.cyan, fontWeight: 600 }}>{c.clicks}</td>
                    <td style={{ padding: "12px 14px", color: c.ctr >= 2.5 ? COLORS.emerald : COLORS.amber }}>
                      {c.ctr.toFixed(2)}%
                    </td>
                    <td style={{ padding: "12px 14px", color: COLORS.emerald, fontWeight: 700 }}>{c.leads}</td>
                    <td style={{ padding: "12px 14px", color: c.costPerLead < 270 ? COLORS.emerald : COLORS.rose, fontWeight: 600 }}>
                      ₪{c.costPerLead}
                    </td>
                    <td style={{ padding: "12px 14px", color: c.roas >= 4 ? COLORS.emerald : COLORS.amber, fontWeight: 700 }}>
                      {c.roas}x
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 36, height: 5, background: COLORS.border, borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${c.score}%`, height: "100%", background: SCORE_COLOR(c.score), borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: SCORE_COLOR(c.score) }}>{c.score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Benchmarks */}
          <div
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 20,
            }}
          >
            <SectionTitle sub="ביחס לממוצע התעשייה">ביצועים vs. בנצ'מרק</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
              {[
                { label: "CTR שלך", yours: parseFloat(avgCTR), benchmark: 2.5, unit: "%", colorKey: "cyan" },
                { label: "עלות/קליק", yours: (totalSpend / totalClicks).toFixed(2), benchmark: 5.5, unit: "₪", colorKey: "violet", lowerBetter: true },
                { label: "עלות/ליד", yours: avgCPL, benchmark: 280, unit: "₪", colorKey: "rose", lowerBetter: true },
                { label: "ROAS ממוצע", yours: (CAMPAIGNS.reduce((a, b) => a + b.roas, 0) / CAMPAIGNS.length).toFixed(1), benchmark: 3.5, unit: "x", colorKey: "emerald" },
              ].map((b, i) => {
                const isGood = b.lowerBetter ? Number(b.yours) <= b.benchmark : Number(b.yours) >= b.benchmark;
                return (
                  <div key={i} style={{ background: COLORS.bg, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 6 }}>{b.label}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: isGood ? COLORS.emerald : COLORS.rose }}>
                        {b.unit === "₪" ? `₪${b.yours}` : `${b.yours}${b.unit}`}
                      </span>
                      <span style={{ fontSize: 10, color: COLORS.textMuted }}>
                        בנצ׳: {b.unit === "₪" ? `₪${b.benchmark}` : `${b.benchmark}${b.unit}`}
                      </span>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 10, color: isGood ? COLORS.emerald : COLORS.rose, fontWeight: 700 }}>
                      {isGood ? "✅ טוב מהממוצע" : "⚠️ מתחת לממוצע"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Tips Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Campaign Score */}
          {selected && (
            <div
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 14,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>קמפיין נבחר</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginTop: 2 }}>
                    {selected.platformIcon} {selected.platform}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: SCORE_COLOR(selected.score) }}>
                    {selected.score}
                  </div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted }}>ציון ביצועים</div>
                </div>
              </div>

              {/* Mini Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "הוצאה", val: formatCurrency(selected.spend), color: COLORS.violet },
                  { label: "לידים", val: selected.leads, color: COLORS.emerald },
                  { label: "CTR", val: `${selected.ctr}%`, color: selected.ctr >= 2.5 ? COLORS.emerald : COLORS.amber },
                  { label: "ROAS", val: `${selected.roas}x`, color: selected.roas >= 4 ? COLORS.emerald : COLORS.amber },
                  { label: "CPL", val: `₪${selected.costPerLead}`, color: selected.costPerLead < 270 ? COLORS.emerald : COLORS.rose },
                  { label: "CPC", val: `₪${selected.costPerClick}`, color: COLORS.cyan },
                ].map((s, i) => (
                  <div key={i} style={{ background: COLORS.bg, borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, color: COLORS.textMuted }}>{s.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Tips */}
          {selected && (
            <div
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.amber}30`,
                borderRadius: 14,
                padding: 20,
                flex: 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>💡</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>המלצות לשיפור</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{selected.name}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {selected.tips.map((tip, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "10px 12px",
                      background: COLORS.amberDim,
                      border: `1px solid ${COLORS.amber}20`,
                      borderRadius: 10,
                    }}
                  >
                    <span style={{ color: COLORS.amber, fontSize: 13, flexShrink: 0, marginTop: 1 }}>
                      {i + 1}.
                    </span>
                    <span style={{ fontSize: 12, color: COLORS.textSub, lineHeight: 1.6 }}>
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 14,
                  padding: "10px 12px",
                  background: COLORS.emeraldDim,
                  border: `1px solid ${COLORS.emerald}20`,
                  borderRadius: 10,
                  fontSize: 11,
                  color: COLORS.emerald,
                  fontWeight: 600,
                }}
              >
                🎯 פוטנציאל: שיפור של 20-30% בביצועים תוך שבועיים
              </div>
            </div>
          )}

          {/* Quick Tip */}
          <div
            style={{
              background: COLORS.cyanDim,
              border: `1px solid ${COLORS.cyan}30`,
              borderRadius: 14,
              padding: "12px 16px",
              fontSize: 11,
              color: COLORS.textSub,
              lineHeight: 1.6,
            }}
          >
            <span style={{ color: COLORS.cyan, fontWeight: 700 }}>💡 טיפ כללי: </span>
            לחץ על שורת קמפיין בטבלה לראות המלצות ספציפיות לאותו קמפיין
          </div>
        </div>
      </div>
    </div>
  );
}
