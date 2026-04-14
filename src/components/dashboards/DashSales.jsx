/**
 * DashSales Component - Sales metrics dashboard
 */
import { useState } from "react";
import { COLORS } from "../../constants/colors.js";
import { DEALS, LEADS, MONTHS, REV } from "../../data/mock-data.js";
import Stat from "../shared/Stat.jsx";
import SectionTitle from "../shared/SectionTitle.jsx";
import Badge from "../shared/Badge.jsx";
import BarChart from "../shared/BarChart.jsx";
import MiniBar from "../shared/MiniBar.jsx";
import DonutChart from "../shared/DonutChart.jsx";
import { formatCurrency } from "../../utils/helpers.js";

export default function DashSales() {
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [callType, setCallType] = useState("טלפון");
  const [callDuration, setCallDuration] = useState("15");
  const [callNotes, setCallNotes] = useState("");
  const [callLink, setCallLink] = useState("");

  const handleOpenCallModal = (call) => {
    setSelectedCall(call);
    setShowCallModal(true);
    setCallType("טלפון");
    setCallDuration("15");
    setCallNotes("");
    setCallLink("");
  };

  const handleCloseCallModal = () => {
    setShowCallModal(false);
    setSelectedCall(null);
  };

  const handleSaveCall = () => {
    alert(
      `✅ שיחה נשמרה!\n👤 ${selectedCall.name}\n📞 סוג: ${callType}\n⏱️ משך: ${callDuration} דק'\n🔗 לינק: ${callLink || "אין"}\n📝 הערות: ${callNotes || "אין"}`
    );
    handleCloseCallModal();
  };

  const handleLaunchCall = () => {
    if (callLink) {
      window.open(callLink, "_blank");
    } else {
      alert("⚠️ נא להכניס לינק לשיחה קודם");
    }
  };

  const pipeline = DEALS.reduce((a, b) => a + b.val, 0);
  const weighted = DEALS.reduce((a, b) => a + b.val * (b.prob / 100), 0);
  const totalLeads = LEADS.length;
  const closedLeads = DEALS.filter((d) => d.stage === "נסגר").length;

  const stageColorMap = {
    חדש: "textMuted",
    "הצעת מחיר": "amber",
    "משא ומתן": "violet",
    נסגר: "emerald",
  };

  const statusColorMap = {
    חדש: "cyan",
    בטיפול: "violet",
    "הצעת מחיר": "amber",
    מעוניין: "emerald",
    "לא מתאים": "rose",
  };

  const statuses = ["חדש", "בטיפול", "הצעת מחיר", "מעוניין", "לא מתאים"];

  const getColor = (colorKey) => COLORS[colorKey] || COLORS.text;

  // Premium animations
  const slideInAnimation = `
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
  `;

  return (
    <div className="fu" style={{ 
      padding: 0, 
      overflowY: "auto", 
      height: "100%",
      background: `linear-gradient(180deg, ${COLORS.bg} 0%, ${COLORS.bgSecondary} 100%)`,
    }}>
      {/* Premium Header with Grand Gradient */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.violet} 0%, ${COLORS.emerald} 50%, ${COLORS.cyan} 100%)`,
        padding: "40px 28px",
        borderBottom: `2px solid rgba(168,85,247,0.2)`,
        boxShadow: "0 20px 50px rgba(168,85,247,0.15)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
          borderRadius: "50%",
          transform: "translate(100px, -100px)",
        }} />
        <div style={{
          position: "relative",
          zIndex: 1,
        }}>
          <h1 style={{ 
            fontSize: 32, 
            fontWeight: 900,
            color: "#fff",
            margin: "0 0 8px 0",
            textShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}>
            💼 דשבורד מכירות פרימיום
          </h1>
          <p style={{ 
            fontSize: 14, 
            color: "rgba(255,255,255,0.85)",
            margin: 0,
            fontWeight: 500,
            letterSpacing: "0.5px",
          }}>
            עסקאות · ביצועים · פייפליין מתקדם
          </p>
        </div>
      </div>

      <div style={{ padding: 28 }}>
      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {/* KPI Card 1 */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.emerald}15 0%, ${COLORS.cyan}15 100%)`,
          border: `2px solid ${COLORS.emerald}`,
          borderRadius: 16,
          padding: 24,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = `0 20px 45px ${COLORS.emerald}25`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}>
          <div style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            background: `radial-gradient(circle, ${COLORS.emerald}20 0%, transparent 70%)`,
            borderRadius: "50%",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "0 0 8px 0", fontWeight: 600 }}>🏆 שיעור סגירה</p>
            <h3 style={{ fontSize: 36, fontWeight: 900, color: COLORS.emerald, margin: "0 0 6px 0" }}>42%</h3>
            <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>↑ מ-31% ברבעון קודם</p>
          </div>
        </div>

        {/* KPI Card 2 */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.amber}15 0%, ${COLORS.violet}15 100%)`,
          border: `2px solid ${COLORS.amber}`,
          borderRadius: 16,
          padding: 24,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = `0 20px 45px ${COLORS.amber}25`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}>
          <div style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            background: `radial-gradient(circle, ${COLORS.amber}20 0%, transparent 70%)`,
            borderRadius: "50%",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "0 0 8px 0", fontWeight: 600 }}>⏱️ זמן מחזור</p>
            <h3 style={{ fontSize: 36, fontWeight: 900, color: COLORS.amber, margin: "0 0 6px 0" }}>18</h3>
            <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>יום בממוצע</p>
          </div>
        </div>

        {/* KPI Card 3 */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.violet}15 0%, ${COLORS.cyan}15 100%)`,
          border: `2px solid ${COLORS.violet}`,
          borderRadius: 16,
          padding: 24,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = `0 20px 45px ${COLORS.violet}25`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}>
          <div style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            background: `radial-gradient(circle, ${COLORS.violet}20 0%, transparent 70%)`,
            borderRadius: "50%",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "0 0 8px 0", fontWeight: 600 }}>👥 לידים נכנסו</p>
            <h3 style={{ fontSize: 36, fontWeight: 900, color: COLORS.violet, margin: "0 0 6px 0" }}>{totalLeads}</h3>
            <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>בטוקו כולל</p>
          </div>
        </div>

        {/* KPI Card 4 */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.rose}15 0%, ${COLORS.amber}15 100%)`,
          border: `2px solid ${COLORS.rose}`,
          borderRadius: 16,
          padding: 24,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = `0 20px 45px ${COLORS.rose}25`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}>
          <div style={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            background: `radial-gradient(circle, ${COLORS.rose}20 0%, transparent 70%)`,
            borderRadius: "50%",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "0 0 8px 0", fontWeight: 600 }}>✅ לידים נסגרו</p>
            <h3 style={{ fontSize: 36, fontWeight: 900, color: COLORS.rose, margin: "0 0 6px 0" }}>{closedLeads}</h3>
            <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>{closedLeads > 0 ? `${((closedLeads / totalLeads) * 100).toFixed(0)}% מסך הלידים` : "אין עדיין"}</p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        {/* Leads Status Distribution */}
        <div
          className="fu s2"
          style={{
            background: `linear-gradient(135deg, ${COLORS.card} 0%, ${COLORS.bgSecondary} 100%)`,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
            backdropFilter: "blur(5px)",
          }}
        >
          <SectionTitle>התפלגות סטטוסי לידים</SectionTitle>
          
          {/* Donut Chart */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, marginTop: 10 }}>
            <DonutChart
              segments={statuses.map((status) => {
                const count = LEADS.filter((l) => l.status === status).length;
                const pct = (count / LEADS.length) * 100;
                return {
                  pct,
                  color: COLORS[statusColorMap[status]],
                };
              })}
              size={140}
            />
          </div>

          {/* Legend */}
          {statuses.map((status, idx) => {
            const count = LEADS.filter((l) => l.status === status).length;
            const colorKey = statusColorMap[status];
            return (
              <div
                key={status}
                style={{
                  marginBottom: idx < statuses.length - 1 ? 10 : 0,
                  fontSize: 11,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: COLORS[colorKey],
                      }}
                    />
                    <span style={{ fontWeight: 600 }}>{status}</span>
                  </div>
                  <span
                    style={{
                      color: COLORS[colorKey],
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Calls */}
        <div
          className="fu s3"
          style={{
            background: `linear-gradient(135deg, ${COLORS.card} 0%, ${COLORS.bgSecondary} 100%)`,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
            backdropFilter: "blur(5px)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <SectionTitle>שיחות אחרונות</SectionTitle>
            <button
              onClick={() => alert("📞 הוסף שיחה חדשה")}
              style={{
                padding: "8px 16px",
                background: `linear-gradient(135deg, ${COLORS.emerald} 0%, ${COLORS.cyan} 100%)`,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 11,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: `0 8px 16px ${COLORS.emerald}33`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 12px 24px ${COLORS.emerald}55`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 8px 16px ${COLORS.emerald}33`;
              }}
            >
              + הוסף שיחה
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{
                borderBottom: `1px solid ${COLORS.border}`,
                background: `linear-gradient(90deg, ${COLORS.card} 0%, ${COLORS.bgSecondary} 100%)`,
              }}>
                {["שם", "סוג", "תאריך", "הערות", "פעולה"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 8px",
                      textAlign: "right",
                      fontSize: 11,
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
              {[
                { name: "נועה שפירא", type: "שיחה", date: "07/04", note: "התעניינות גבוהה" },
                { name: "אלון פרץ", type: "וידיאו", date: "06/04", note: "דיון על תמחיר" },
                { name: "ריבי אוחנה", type: "שיחה", date: "05/04", note: "בדיקת צרכים" },
                { name: "גל מוזס", type: "אימייל", date: "04/04", note: "שליחת הצעה" },
                { name: "דור מנור", type: "וידיאו", date: "03/04", note: "ישיבת סגירה" },
              ].map((call, i) => (
                <tr
                  key={i}
                  className="row"
                  style={{
                    borderBottom:
                      i < 4 ? `1px solid ${COLORS.border}` : "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${COLORS.card}44`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <td style={{ padding: "12px 8px" }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: COLORS.text,
                      }}
                    >
                      {call.name}
                    </p>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <Badge
                      label={call.type}
                      colorKey={
                        call.type === "שיחה"
                          ? "cyan"
                          : call.type === "וידיאו"
                          ? "violet"
                          : "amber"
                      }
                    />
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      fontSize: 12,
                      color: COLORS.textMuted,
                    }}
                  >
                    {call.date}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      fontSize: 12,
                      color: COLORS.textMuted,
                    }}
                  >
                    {call.note}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      textAlign: "center",
                    }}
                  >
                    <button
                      onClick={() => handleOpenCallModal(call)}
                      style={{
                        padding: "6px 8px",
                        background: COLORS.violet,
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = COLORS.cyan;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = COLORS.violet;
                      }}
                    >
                      🔊
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Call Modal */}
      {showCallModal && selectedCall && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 900,
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.3s ease",
          }}
          onClick={handleCloseCallModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: `linear-gradient(135deg, ${COLORS.card} 0%, ${COLORS.bgSecondary} 100%)`,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: 28,
              maxWidth: 420,
              width: "90%",
              boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 0 40px rgba(168,85,247,0.1)",
              animation: "slideInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: COLORS.text,
                marginBottom: 6,
              }}
            >
              📞 פרטי שיחה
            </h2>
            <p
              style={{
                fontSize: 13,
                color: COLORS.textMuted,
                marginBottom: 20,
              }}
            >
              עם {selectedCall.name}
            </p>

            {/* Form Fields */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: COLORS.text,
                  marginBottom: 6,
                }}
              >
                לינק לשיחה:
              </label>
              <input
                type="text"
                value={callLink}
                onChange={(e) => setCallLink(e.target.value)}
                placeholder="https://zoom.us/... או כל לינק אחר"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  background: COLORS.bgSecondary,
                  color: COLORS.text,
                  fontSize: 12,
                  boxSizing: "border-box",
                  transition: "all 0.3s",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = COLORS.violet;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${COLORS.violet}22`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = COLORS.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: COLORS.text,
                  marginBottom: 6,
                }}
              >
                סוג שיחה:
              </label>
              <select
                value={callType}
                onChange={(e) => setCallType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  background: COLORS.bgSecondary,
                  color: COLORS.text,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                <option>טלפון</option>
                <option>וידיאו</option>
                <option>ווידיאו קול</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: COLORS.text,
                  marginBottom: 6,
                }}
              >
                משך השיחה (דקות):
              </label>
              <input
                type="number"
                value={callDuration}
                onChange={(e) => setCallDuration(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  background: COLORS.bgSecondary,
                  color: COLORS.text,
                  fontSize: 12,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: COLORS.text,
                  marginBottom: 6,
                }}
              >
                הערות / תוצאה:
              </label>
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="תוצאת השיחה, עדכונים חשובים..."
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  background: COLORS.bgSecondary,
                  color: COLORS.text,
                  fontSize: 12,
                  minHeight: 80,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  resize: "none",
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handleCloseCallModal}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: COLORS.bgSecondary,
                  color: COLORS.text,
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = COLORS.border;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 16px ${COLORS.border}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = COLORS.bgSecondary;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                ביטול
              </button>
              <button
                onClick={handleSaveCall}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: `linear-gradient(135deg, ${COLORS.emerald} 0%, ${COLORS.cyan} 100%)`,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: `0 10px 25px ${COLORS.emerald}33`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = `0 15px 35px ${COLORS.emerald}55`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 10px 25px ${COLORS.emerald}33`;
                }}
              >
                ✅ שמור שיחה
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 14,
        }}
      >
        {/* Leads Scoring */}
        <div
          className="fu s4"
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <SectionTitle>ניקוד לידים</SectionTitle>
          {LEADS.map((l, i) => (
            <div
              key={i}
              className="row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                borderBottom:
                  i < LEADS.length - 1 ? `1px solid ${COLORS.border}` : "none",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: COLORS.cyanDim,
                  color: COLORS.cyan,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {l.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {l.name}
                </p>
                <p style={{ fontSize: 10, color: COLORS.textMuted }}>
                  {l.status}
                </p>
              </div>
              <div style={{ flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color:
                      l.score >= 80
                        ? COLORS.emerald
                        : l.score >= 60
                        ? COLORS.amber
                        : COLORS.rose,
                    background: (l.score >= 80
                      ? COLORS.emerald
                      : l.score >= 60
                      ? COLORS.amber
                      : COLORS.rose) + "18",
                    padding: "2px 8px",
                    borderRadius: 20,
                  }}
                >
                  {l.score}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Calls & Followups Schedule */}
        <div
          className="fu s5"
          style={{
            background: `linear-gradient(135deg, ${COLORS.card}dd 0%, ${COLORS.bgSecondary}dd 100%)`,
            border: `1.5px solid ${COLORS.emerald}40`,
            borderRadius: 18,
            padding: 28,
            boxShadow: "0 20px 50px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
          }}
        >
          <SectionTitle>לוח זמנים - שיחות וקריאות</SectionTitle>
          {[
            { name: "נועה שפירא", type: "שיחה חדשה", time: "היום 14:00", colorKey: "emerald" },
            { name: "אלון פרץ", type: "פולואפ", time: "היום 16:30", colorKey: "violet" },
            { name: "ריבי אוחנה", type: "שיחה חדשה", time: "מחר 10:00", colorKey: "emerald" },
            { name: "גל מוזס", type: "פולואפ", time: "מחר 14:00", colorKey: "cyan" },
            { name: "דור מנור", type: "שיחה חדשה", time: "יום ב׳ 09:00", colorKey: "amber" },
          ].map((call, i) => (
            <div
              key={i}
              style={{
                marginBottom: i < 4 ? 12 : 0,
                paddingBottom: i < 4 ? 12 : 0,
                borderBottom: i < 4 ? `1px solid ${COLORS.border}` : "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${COLORS.card}44`;
                e.currentTarget.style.borderRadius = "8px";
                e.currentTarget.style.padding = "8px";
                e.currentTarget.style.marginLeft = "-8px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderRadius = "0px";
                e.currentTarget.style.padding = "0px";
                e.currentTarget.style.marginLeft = "0px";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: COLORS.text,
                      marginBottom: 2,
                    }}
                  >
                    {call.name}
                  </p>
                  <p style={{ fontSize: 11, color: COLORS.textMuted }}>
                    {call.type}
                  </p>
                </div>
                <Badge label={call.type} colorKey={call.colorKey} />
              </div>
              <p style={{ fontSize: 11, color: COLORS.textMuted }}>
                🕐 {call.time}
              </p>
            </div>
          ))}
        </div>

        {/* Monthly Sales */}
        <div
          className="fu s6"
          style={{
            background: `linear-gradient(135deg, ${COLORS.card}dd 0%, ${COLORS.bgSecondary}dd 100%)`,
            border: `1.5px solid ${COLORS.violet}40`,
            borderRadius: 18,
            padding: 28,
            boxShadow: "0 20px 50px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
            padding: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
            backdropFilter: "blur(5px)",
          }}
        >
          <SectionTitle>מכירות חודשיות</SectionTitle>
          <BarChart
            data={REV}
            labels={MONTHS}
            colorKey="violet"
            h={90}
            target={70000}
          />
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 10,
              fontSize: 11,
              color: COLORS.textMuted,
            }}
          >
            <span>סה"כ: {formatCurrency(REV.reduce((a, b) => a + b))}</span>
            <span>
              ממוצע:{" "}
              {formatCurrency(
                Math.round(REV.reduce((a, b) => a + b) / REV.length)
              )}
            </span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
