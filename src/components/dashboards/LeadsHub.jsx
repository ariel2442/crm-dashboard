/**
 * LeadsHub Component - Comprehensive leads management with Kanban, analytics & filtering
 */
import { useState } from "react";
import { COLORS } from "../../constants/colors.js";
import { LEADS } from "../../data/mock-data.js";
import Stat from "../shared/Stat.jsx";
import SectionTitle from "../shared/SectionTitle.jsx";
import Badge from "../shared/Badge.jsx";
import DonutChart from "../shared/DonutChart.jsx";
import { formatCurrency } from "../../utils/helpers.js";

export default function LeadsHub() {
  const [filterStatus, setFilterStatus] = useState("הכל");
  const [draggedLead, setDraggedLead] = useState(null);
  const [leads, setLeads] = useState(LEADS);

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

  const statuses = ["חדש", "בטיפול", "הצעת מחיר", "מעוניין", "לא מתאים"];
  const allStatuses = ["הכל", ...statuses];

  const filteredLeads =
    filterStatus === "הכל"
      ? leads
      : leads.filter((l) => l.status === filterStatus);

  // Analytics
  const totalValue = leads.reduce((a, b) => a + b.val, 0);
  const avScore = (leads.reduce((a, b) => a + b.score, 0) / leads.length).toFixed(1);
  const sources = {};
  leads.forEach((l) => {
    sources[l.src] = (sources[l.src] || 0) + 1;
  });
  const topSource = Object.entries(sources).sort((a, b) => b[1] - a[1])[0];

  const statusColorMap = {
    חדש: "cyan",
    בטיפול: "violet",
    "הצעת מחיר": "amber",
    מעוניין: "emerald",
    "לא מתאים": "rose",
  };

  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnStatus = (status) => {
    if (draggedLead && draggedLead.status !== status) {
      setLeads(
        leads.map((l) =>
          l.id === draggedLead.id ? { ...l, status } : l
        )
      );
    }
    setDraggedLead(null);
  };

  return (
    <div className="fu" style={{ 
      padding: 0, 
      overflowY: "auto", 
      height: "100%",
      background: `linear-gradient(180deg, ${COLORS.bg} 0%, ${COLORS.bgSecondary} 100%)`,
    }}>
      {/* Premium Header with Grand Gradient */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.cyan} 0%, ${COLORS.violet} 50%, ${COLORS.emerald} 100%)`,
        padding: "40px 28px",
        borderBottom: `2px solid rgba(34,211,238,0.2)`,
        boxShadow: "0 20px 50px rgba(34,211,238,0.15)",
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
            🎯 מצביע לידים פרימיום
          </h1>
          <p style={{ 
            fontSize: 14, 
            color: "rgba(255,255,255,0.85)",
            margin: 0,
            fontWeight: 500,
            letterSpacing: "0.5px",
          }}>
            קנבן · ניהול לידים · אנליטיקה מתקדמת
          </p>
        </div>
      </div>

      <div style={{ padding: 28 }}>
      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {allStatuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: filterStatus === s ? "none" : `1px solid ${COLORS.border}`,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              background:
                filterStatus === s ? `linear-gradient(135deg, ${COLORS.violet} 0%, ${COLORS.cyan} 100%)` : COLORS.bgSecondary,
              color: filterStatus === s ? "#fff" : COLORS.textMuted,
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: filterStatus === s ? `0 8px 20px ${COLORS.violet}33` : "none",
            }}
            onMouseEnter={(e) => {
              if (filterStatus !== s) {
                e.currentTarget.style.borderColor = COLORS.violet;
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (filterStatus !== s) {
                e.currentTarget.style.borderColor = COLORS.border;
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Kanban Columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${statuses.length}, 1fr)`,
          gap: 14,
          marginBottom: 20,
        }}
      >
        {statuses.map((status) => {
          const statusLeads = leads.filter((l) => l.status === status);
          const statusValue = statusLeads.reduce((a, b) => a + b.val, 0);
          const colorKey = statusColorMap[status];

          return (
            <div
              key={status}
              onDragOver={handleDragOver}
              onDrop={() => handleDropOnStatus(status)}
              style={{
                background: `linear-gradient(135deg, ${COLORS.card} 0%, ${COLORS.bgSecondary} 100%)`,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 14,
                padding: 14,
                minHeight: 500,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2), 0 0 1px rgba(168,85,247,0.1)",
                transition: "all 0.3s ease",
                backdropFilter: "blur(5px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 15px 40px rgba(0,0,0,0.3), 0 0 20px ${COLORS[statusColorMap[status]]}22`;
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2), 0 0 1px rgba(168,85,247,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <h3
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: COLORS.text,
                    marginBottom: 4,
                  }}
                >
                  {status}
                </h3>
                <p
                  style={{
                    fontSize: 11,
                    color: COLORS.textMuted,
                    marginBottom: 4,
                  }}
                >
                  {statusLeads.length} לידים
                </p>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS[colorKey],
                  }}
                >
                  {formatCurrency(statusValue)}
                </p>
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                {statusLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead)}
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.bgSecondary} 0%, ${COLORS.card} 100%)`,
                      border: `1.5px solid ${COLORS.border}`,
                      borderRadius: 10,
                      padding: 12,
                      cursor: "grab",
                      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      opacity: draggedLead?.id === lead.id ? 0.5 : 1,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = COLORS[colorKey];
                      e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                      e.currentTarget.style.boxShadow = `0 12px 24px ${COLORS[colorKey]}33`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = COLORS.border;
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: COLORS.text,
                        marginBottom: 4,
                      }}
                    >
                      {lead.name}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: COLORS.textMuted,
                        marginBottom: 6,
                      }}
                    >
                      {lead.co}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <Badge label={lead.src} colorKey="textMuted" />
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: COLORS.emerald,
                        }}
                      >
                        {formatCurrency(lead.val)}
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
                      <span>⭐ {lead.score}</span>
                      <span>{lead.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Leads Table */}
      <div
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
        <SectionTitle sub={`${filteredLeads.length} לידים`}>
          טבלת לידים מפורטת
        </SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12,
            }}
          >
            <thead>
              <tr style={{
                borderBottom: `1px solid ${COLORS.border}`,
                background: `linear-gradient(90deg, ${COLORS.card} 0%, ${COLORS.bgSecondary} 100%)`,
              }}>
                <th
                  style={{
                    padding: "12px 0",
                    textAlign: "right",
                    fontWeight: 600,
                    color: COLORS.textMuted,
                  }}
                >
                  שם
                </th>
                <th
                  style={{
                    padding: "12px 0",
                    textAlign: "right",
                    fontWeight: 600,
                    color: COLORS.textMuted,
                  }}
                >
                  חברה
                </th>
                <th
                  style={{
                    padding: "12px 0",
                    textAlign: "center",
                    fontWeight: 600,
                    color: COLORS.textMuted,
                  }}
                >
                  מקור
                </th>
                <th
                  style={{
                    padding: "12px 0",
                    textAlign: "center",
                    fontWeight: 600,
                    color: COLORS.textMuted,
                  }}
                >
                  סטטוס
                </th>
                <th
                  style={{
                    padding: "12px 0",
                    textAlign: "center",
                    fontWeight: 600,
                    color: COLORS.textMuted,
                  }}
                >
                  ערך עסקה
                </th>
                <th
                  style={{
                    padding: "12px 0",
                    textAlign: "center",
                    fontWeight: 600,
                    color: COLORS.textMuted,
                  }}
                >
                  ניקוד
                </th>
                <th
                  style={{
                    padding: "12px 0",
                    textAlign: "center",
                    fontWeight: 600,
                    color: COLORS.textMuted,
                  }}
                >
                  תאריך
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, idx) => (
                <tr
                  key={lead.id}
                  style={{
                    borderBottom:
                      idx < filteredLeads.length - 1
                        ? `1px solid ${COLORS.border}`
                        : "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${COLORS.card}44`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <td
                    style={{
                      padding: "12px 0",
                      textAlign: "right",
                      fontWeight: 600,
                      color: COLORS.text,
                    }}
                  >
                    {lead.name}
                  </td>
                  <td
                    style={{
                      padding: "12px 0",
                      textAlign: "right",
                      color: COLORS.textMuted,
                    }}
                  >
                    {lead.co}
                  </td>
                  <td style={{ padding: "12px 0", textAlign: "center" }}>
                    <Badge label={lead.src} colorKey="textMuted" />
                  </td>
                  <td style={{ padding: "12px 0", textAlign: "center" }}>
                    <Badge
                      label={lead.status}
                      colorKey={statusColorMap[lead.status]}
                    />
                  </td>
                  <td
                    style={{
                      padding: "12px 0",
                      textAlign: "center",
                      fontWeight: 700,
                      color: COLORS.emerald,
                    }}
                  >
                    {formatCurrency(lead.val)}
                  </td>
                  <td
                    style={{
                      padding: "12px 0",
                      textAlign: "center",
                      color: COLORS.amber,
                      fontWeight: 600,
                    }}
                  >
                    ⭐ {lead.score}
                  </td>
                  <td
                    style={{
                      padding: "12px 0",
                      textAlign: "center",
                      color: COLORS.textMuted,
                    }}
                  >
                    {lead.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sources Analytics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginTop: 20,
        }}
      >
        {/* Source Distribution */}
        <div
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
          <SectionTitle>התפלגות מקורות</SectionTitle>
          {Object.entries(sources)
            .sort((a, b) => b[1] - a[1])
            .map(([source, count], idx) => (
              <div
                key={source}
                style={{
                  marginBottom: idx < Object.keys(sources).length - 1 ? 12 : 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                    fontSize: 12,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{source}</span>
                  <span
                    style={{
                      color: COLORS.violet,
                      fontWeight: 700,
                    }}
                  >
                    {count} ({((count / leads.length) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 8,
                    background: COLORS.bgSecondary,
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(count / Math.max(...Object.values(sources))) * 100}%`,
                      background: `linear-gradient(90deg, ${COLORS.violet} 0%, ${COLORS.cyan} 100%)`,
                      borderRadius: 4,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
            ))}
        </div>

        {/* Status Distribution */}
        <div
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
          <SectionTitle>התפלגות סטטוסים</SectionTitle>
          
          {/* Donut Chart */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <DonutChart
              segments={statuses.map((status) => {
                const count = leads.filter((l) => l.status === status).length;
                const pct = (count / leads.length) * 100;
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
            const count = leads.filter((l) => l.status === status).length;
            const colorKey = statusColorMap[status];
            return (
              <div
                key={status}
                style={{
                  marginBottom: idx < statuses.length - 1 ? 12 : 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                    fontSize: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
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
                    {count} ({((count / leads.length) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}
