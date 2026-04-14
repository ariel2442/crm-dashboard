/**
 * OrganicLeads - Leads from Instagram, Landing Page, WhatsApp, Referrals, Google
 */
import { useState } from "react";
import { COLORS } from "../../constants/colors.js";
import { ORGANIC_LEADS } from "../../data/mock-data.js";

const STATUS_COLORS = {
  "חדש": "cyan",
  "בטיפול": "violet",
  "מעוניין": "amber",
  "הצעת מחיר": "emerald",
  "נסגר": "emerald",
  "לא מתאים": "rose",
};

const SOURCES = ["הכל", "אינסטגרם DM", "דף נחיתה", "וואטסאפ", "הפניה", "גוגל אורגני"];

export default function OrganicLeads() {
  const [activeSource, setActiveSource] = useState("הכל");
  const [activeStatus, setActiveStatus] = useState("הכל");
  const [selectedLead, setSelectedLead] = useState(null);
  const [note, setNote] = useState("");

  const getColor = (key) => COLORS[key] || COLORS.text;

  const filtered = ORGANIC_LEADS.filter((l) => {
    const srcOk = activeSource === "הכל" || l.source === activeSource;
    const stOk = activeStatus === "הכל" || l.status === activeStatus;
    return srcOk && stOk;
  });

  const sourceCounts = SOURCES.slice(1).map((s) => ({
    name: s,
    count: ORGANIC_LEADS.filter((l) => l.source === s).length,
    icon: ORGANIC_LEADS.find((l) => l.source === s)?.sourceIcon,
    colorKey: ORGANIC_LEADS.find((l) => l.source === s)?.sourceColor,
  }));

  const statuses = ["הכל", ...Object.keys(STATUS_COLORS)];
  const closedDeals = ORGANIC_LEADS.filter((l) => l.status === "נסגר").length;
  const activeLeads = ORGANIC_LEADS.filter((l) => ["בטיפול", "הצעת מחיר", "מעוניין"].includes(l.status)).length;

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: 24,
        direction: "rtl",
        fontFamily: "'Rubik', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>
          לידים אורגניים 🌱
        </h2>
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>
          אינסטגרם · דף נחיתה · וואטסאפ · הפניות · גוגל
        </p>
      </div>

      {/* KPI Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          { label: "סה״כ לידים", val: ORGANIC_LEADS.length, icon: "◎", color: COLORS.cyan },
          { label: "פעילים", val: activeLeads, icon: "⚡", color: COLORS.violet },
          { label: "עסקאות סגורות", val: closedDeals, icon: "✅", color: COLORS.emerald },
          { label: "ממוצע/יום", val: "2.1", icon: "📅", color: COLORS.amber },
          { label: "המרה", val: `${Math.round((closedDeals / ORGANIC_LEADS.length) * 100)}%`, icon: "🎯", color: COLORS.rose },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: "16px 18px",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        {/* Main Panel */}
        <div>
          {/* Source Filter */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            {SOURCES.map((s) => {
              const active = s === activeSource;
              const count = s === "הכל" ? ORGANIC_LEADS.length : ORGANIC_LEADS.filter((l) => l.source === s).length;
              const src = ORGANIC_LEADS.find((l) => l.source === s);
              return (
                <button
                  key={s}
                  onClick={() => setActiveSource(s)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: `1px solid ${active ? COLORS.cyan : COLORS.border}`,
                    background: active ? COLORS.cyanDim : "transparent",
                    color: active ? COLORS.cyan : COLORS.textSub,
                    fontSize: 12,
                    fontWeight: active ? 700 : 400,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {src && <span>{src.sourceIcon}</span>}
                  {s} ({count})
                </button>
              );
            })}
          </div>

          {/* Status Filter */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            {statuses.map((s) => {
              const active = s === activeStatus;
              const colorKey = STATUS_COLORS[s] || "textMuted";
              const color = getColor(colorKey);
              return (
                <button
                  key={s}
                  onClick={() => setActiveStatus(s)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 14,
                    border: `1px solid ${active ? color : COLORS.border}`,
                    background: active ? color + "18" : "transparent",
                    color: active ? color : COLORS.textMuted,
                    fontSize: 11,
                    fontWeight: active ? 700 : 400,
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>

          {/* Leads Table */}
          <div
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  {["שם ועסק", "מקור", "סטטוס", "תאריך", "הערה", ""].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontWeight: 600,
                        fontSize: 11,
                        color: COLORS.textMuted,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => {
                  const statusColor = getColor(STATUS_COLORS[lead.status] || "textMuted");
                  return (
                    <tr
                      key={lead.id}
                      style={{
                        borderBottom: `1px solid ${COLORS.border}40`,
                        transition: "background 0.12s",
                        cursor: "pointer",
                        background:
                          selectedLead?.id === lead.id ? COLORS.cyanDim : "transparent",
                      }}
                      onClick={() => {
                        setSelectedLead(lead);
                        setNote(lead.note);
                      }}
                    >
                      {/* Name */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 600, color: COLORS.text }}>{lead.name}</div>
                        <div style={{ fontSize: 11, color: COLORS.textMuted }}>{lead.company}</div>
                      </td>

                      {/* Source */}
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 10px",
                            borderRadius: 20,
                            background: getColor(lead.sourceColor) + "15",
                            color: getColor(lead.sourceColor),
                            fontSize: 11,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {lead.sourceIcon} {lead.source}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: 12,
                            background: statusColor + "18",
                            color: statusColor,
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {lead.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: "14px 16px", color: COLORS.textMuted, fontSize: 12 }}>
                        {lead.date}
                      </td>

                      {/* Note */}
                      <td
                        style={{
                          padding: "14px 16px",
                          color: COLORS.textSub,
                          fontSize: 11,
                          maxWidth: 220,
                        }}
                      >
                        <span
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {lead.note}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: "14px 16px" }}>
                        <a
                          href={`https://wa.me/972${lead.phone.slice(1)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            padding: "5px 10px",
                            background: "rgba(37,211,102,0.12)",
                            border: "1px solid rgba(37,211,102,0.3)",
                            borderRadius: 8,
                            color: "#25D366",
                            fontSize: 11,
                            fontWeight: 700,
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          💬 WA
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: 32, textAlign: "center", color: COLORS.textMuted, fontSize: 13 }}>
                אין לידים תואמים לסינון
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Source Breakdown */}
          <div
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 18,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>
              מקורות לידים
            </div>
            {sourceCounts.map((s) => {
              const pct = Math.round((s.count / ORGANIC_LEADS.length) * 100);
              const color = getColor(s.colorKey);
              return (
                <div key={s.name} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ color: COLORS.textSub }}>
                      {s.icon} {s.name}
                    </span>
                    <span style={{ color, fontWeight: 700 }}>
                      {s.count} ({pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: COLORS.border,
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: color,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lead Detail Panel */}
          {selectedLead ? (
            <div
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 14,
                padding: 18,
                flex: 1,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>
                פרטי ליד
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.text }}>
                    {selectedLead.name}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>{selectedLead.company}</div>
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    borderRadius: 20,
                    background: getColor(selectedLead.sourceColor) + "15",
                    color: getColor(selectedLead.sourceColor),
                    fontSize: 11,
                    fontWeight: 600,
                    width: "fit-content",
                  }}
                >
                  {selectedLead.sourceIcon} {selectedLead.source}
                </div>
                <a
                  href={`tel:${selectedLead.phone}`}
                  style={{ color: COLORS.cyan, fontSize: 13, textDecoration: "none" }}
                >
                  📞 {selectedLead.phone}
                </a>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>📅 {selectedLead.date}</div>

                <div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 5 }}>הערות</div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    style={{
                      width: "100%",
                      background: COLORS.bg,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 8,
                      padding: "8px 10px",
                      color: COLORS.text,
                      fontSize: 12,
                      resize: "none",
                      direction: "rtl",
                      fontFamily: "'Rubik', sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <a
                    href={`https://wa.me/972${selectedLead.phone.slice(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      background: "rgba(37,211,102,0.12)",
                      border: "1px solid rgba(37,211,102,0.3)",
                      borderRadius: 9,
                      color: "#25D366",
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    💬 WhatsApp
                  </a>
                  <a
                    href={`tel:${selectedLead.phone}`}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      background: COLORS.cyanDim,
                      border: `1px solid ${COLORS.cyan}40`,
                      borderRadius: 9,
                      color: COLORS.cyan,
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    📞 התקשר
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 14,
                padding: 18,
                textAlign: "center",
                color: COLORS.textMuted,
                fontSize: 12,
              }}
            >
              לחץ על ליד לפרטים
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
