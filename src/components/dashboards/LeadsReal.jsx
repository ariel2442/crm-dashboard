/**
 * LeadsReal — real leads from WordPress with status workflow.
 * Table layout: שם | סוג | תאריך | הערות | פעולה
 * Clicking "רוצה לסגור" (via form) triggers the future quote modal (stage 2).
 */
import { useEffect, useState } from "react";
import { COLORS } from "../../constants/colors.js";
import {
  listLeads,
  createLead,
  updateLead,
  deleteLead,
  LEAD_STATUSES,
  getStatusMeta,
} from "../../api/leads.js";
import QuoteModal from "../quotes/QuoteModal.jsx";

const SERVICE_TYPES = ["אתר עסקי", "חנות אונליין", "מערכת CRM", "ייעוץ", "אחר"];
const SOURCES = ["פייסבוק", "גוגל", "המלצה", "אתר", "וואטסאפ", "אחר"];

const SOURCE_COLOR = {
  פייסבוק: "violet",
  גוגל: "cyan",
  המלצה: "emerald",
  אתר: "amber",
  וואטסאפ: "emerald",
  אחר: "textMuted",
};

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
};

export default function LeadsReal() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [quoteLead, setQuoteLead] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      setLeads(await listLeads());
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSaved = (lead, wasClosingIntent) => {
    setLeads((prev) => {
      const exists = prev.find((l) => l.id === lead.id);
      return exists
        ? prev.map((l) => (l.id === lead.id ? lead : l))
        : [lead, ...prev];
    });
    setShowForm(false);
    setEditing(null);
    if (wasClosingIntent || lead.meta.status === "closing") {
      setQuoteLead(lead);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("למחוק את הליד?")) return;
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const visible =
    filter === "all" ? leads : leads.filter((l) => l.meta.status === filter);

  const counts = LEAD_STATUSES.reduce((acc, s) => {
    acc[s.id] = leads.filter((l) => l.meta.status === s.id).length;
    return acc;
  }, {});

  return (
    <div className="fu" style={{ padding: 24, overflowY: "auto", height: "100%" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          style={addBtn}
        >
          + הוסף ליד
        </button>
        <div style={{ textAlign: "left" }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: COLORS.text,
              borderBottom: `2px solid ${COLORS.cyan}`,
              paddingBottom: 4,
              display: "inline-block",
            }}
          >
            לידים אחרונים
          </h2>
        </div>
      </div>

      {/* Status filter pills */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <FilterPill
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label={`הכל (${leads.length})`}
          colorKey="cyan"
        />
        {LEAD_STATUSES.map((s) => (
          <FilterPill
            key={s.id}
            active={filter === s.id}
            onClick={() => setFilter(s.id)}
            label={`${s.label} (${counts[s.id] || 0})`}
            colorKey={s.colorKey}
          />
        ))}
      </div>

      {err && <ErrorBox message={err} />}
      {loading && <div style={{ color: COLORS.textMuted }}>טוען...</div>}

      {showForm && (
        <LeadForm
          initial={editing}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSaved={onSaved}
        />
      )}

      {!loading && !visible.length && !showForm && (
        <div
          style={{
            background: COLORS.card,
            border: `1px dashed ${COLORS.border}`,
            borderRadius: 14,
            padding: 40,
            textAlign: "center",
            color: COLORS.textMuted,
          }}
        >
          אין לידים בסטטוס הזה
        </div>
      )}

      {!!visible.length && (
        <div
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 720,
              }}
            >
              <thead>
                <tr>
                  <Th align="right">שם</Th>
                  <Th>סוג</Th>
                  <Th>תאריך</Th>
                  <Th>הערות</Th>
                  <Th>פעולה</Th>
                </tr>
              </thead>
              <tbody>
                {visible.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    onEdit={() => {
                      setEditing(lead);
                      setShowForm(true);
                    }}
                    onDelete={() => onDelete(lead.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {quoteLead && (
        <QuoteModal
          lead={quoteLead}
          onClose={() => setQuoteLead(null)}
          onSaved={() => {}}
        />
      )}
    </div>
  );
}

/* ---------- Table header cell ---------- */
function Th({ children, align = "center" }) {
  return (
    <th
      style={{
        padding: "16px 18px",
        fontSize: 12,
        fontWeight: 700,
        color: COLORS.textMuted,
        borderBottom: `1px solid ${COLORS.border}`,
        textAlign: align,
        background: "rgba(255,255,255,0.02)",
      }}
    >
      {children}
    </th>
  );
}

/* ---------- Table row ---------- */
function LeadRow({ lead, onEdit, onDelete }) {
  const status = getStatusMeta(lead.meta.status);
  const statusColor = COLORS[status.colorKey] || COLORS.cyan;
  const sourceKey = lead.meta.source || "אחר";
  const sourceColor = COLORS[SOURCE_COLOR[sourceKey] || "cyan"];

  return (
    <tr
      className="row"
      style={{
        borderBottom: `1px solid ${COLORS.border}`,
        borderRight: `3px solid ${statusColor}`,
      }}
    >
      {/* שם */}
      <td
        style={{
          padding: "16px 18px",
          textAlign: "right",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: statusColor,
              boxShadow: `0 0 8px ${statusColor}`,
              flexShrink: 0,
            }}
            title={status.label}
          />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: COLORS.text,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {lead.title || "ללא שם"}
            </div>
            {lead.meta.phone && (
              <div
                style={{
                  fontSize: 11,
                  color: COLORS.textMuted,
                  marginTop: 2,
                }}
              >
                📞 {lead.meta.phone}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* סוג */}
      <td style={{ padding: "16px 18px", textAlign: "center" }}>
        <span
          style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            color: sourceColor,
            background: sourceColor + "15",
            border: `1.5px solid ${sourceColor}60`,
            whiteSpace: "nowrap",
          }}
        >
          {sourceKey}
        </span>
      </td>

      {/* תאריך */}
      <td
        style={{
          padding: "16px 18px",
          textAlign: "center",
          fontSize: 12,
          color: COLORS.textSub,
          fontWeight: 500,
        }}
      >
        {formatDate(lead.date)}
      </td>

      {/* הערות */}
      <td
        style={{
          padding: "16px 18px",
          textAlign: "center",
          fontSize: 12,
          color: COLORS.textMuted,
          maxWidth: 240,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {lead.meta.notes || lead.meta.service_type || "—"}
      </td>

      {/* פעולה */}
      <td style={{ padding: "16px 18px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            gap: 6,
          }}
        >
          <button
            onClick={onEdit}
            title="ערוך ליד"
            style={actionBtn}
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            title="מחק"
            style={{
              ...actionBtn,
              background: "rgba(244,63,94,0.12)",
              border: `1px solid ${COLORS.rose}40`,
            }}
          >
            🗑
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ---------- Lead form ---------- */
function LeadForm({ initial, onCancel, onSaved }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [meta, setMeta] = useState({
    phone: initial?.meta?.phone || "",
    email: initial?.meta?.email || "",
    service_type: initial?.meta?.service_type || SERVICE_TYPES[0],
    source: initial?.meta?.source || SOURCES[0],
    budget: initial?.meta?.budget || "",
    notes: initial?.meta?.notes || "",
    status: initial?.meta?.status || "new",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const saved = initial
        ? await updateLead(initial.id, { title, meta })
        : await createLead({ title, meta });
      onSaved(saved, meta.status === "closing");
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: 22,
        marginBottom: 14,
      }}
    >
      <h3 style={{ fontSize: 15, fontWeight: 800, color: COLORS.text, marginBottom: 14 }}>
        {initial ? "עריכת ליד" : "ליד חדש"}
      </h3>

      <div style={{ marginBottom: 10 }}>
        <label style={labelStyle}>שם הליד *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
          required
          autoFocus
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <label style={labelStyle}>טלפון</label>
          <input
            type="tel"
            value={meta.phone}
            onChange={(e) => setMeta({ ...meta, phone: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>אימייל</label>
          <input
            type="email"
            value={meta.email}
            onChange={(e) => setMeta({ ...meta, email: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>סוג שירות</label>
          <select
            value={meta.service_type}
            onChange={(e) => setMeta({ ...meta, service_type: e.target.value })}
            style={inputStyle}
          >
            {SERVICE_TYPES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>מקור</label>
          <select
            value={meta.source}
            onChange={(e) => setMeta({ ...meta, source: e.target.value })}
            style={inputStyle}
          >
            {SOURCES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>תקציב משוער</label>
          <input
            type="text"
            value={meta.budget}
            onChange={(e) => setMeta({ ...meta, budget: e.target.value })}
            placeholder="₪"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>סטטוס</label>
          <select
            value={meta.status}
            onChange={(e) => setMeta({ ...meta, status: e.target.value })}
            style={inputStyle}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <label style={labelStyle}>הערות</label>
        <textarea
          value={meta.notes}
          onChange={(e) => setMeta({ ...meta, notes: e.target.value })}
          style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
        />
      </div>

      {err && <ErrorBox message={err} />}

      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button type="submit" disabled={busy} style={primaryBtn}>
          {busy ? "שומר..." : initial ? "עדכן" : "צור ליד"}
        </button>
        <button type="button" onClick={onCancel} style={secondaryBtn}>
          ביטול
        </button>
      </div>
    </form>
  );
}

/* ---------- Small helpers ---------- */
function FilterPill({ active, onClick, label, colorKey }) {
  const c = COLORS[colorKey] || COLORS.cyan;
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 14px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        border: `1px solid ${active ? c : COLORS.border}`,
        background: active ? c + "20" : "transparent",
        color: active ? c : COLORS.textMuted,
      }}
    >
      {label}
    </button>
  );
}

function ErrorBox({ message }) {
  return (
    <div
      style={{
        background: "rgba(244,63,94,0.1)",
        color: COLORS.rose,
        border: `1px solid ${COLORS.rose}40`,
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 12,
        marginBottom: 10,
      }}
    >
      {message}
    </div>
  );
}

/* ---------- Styles ---------- */
const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#cbd5e1",
  marginBottom: 4,
};
const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 9,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  fontSize: 12,
  outline: "none",
  direction: "rtl",
};
const addBtn = {
  padding: "11px 20px",
  borderRadius: 10,
  background: `linear-gradient(135deg, ${COLORS.emerald} 0%, ${COLORS.cyan} 100%)`,
  color: "#fff",
  fontSize: 13,
  fontWeight: 800,
  border: "none",
  cursor: "pointer",
  boxShadow: `0 6px 20px ${COLORS.emerald}40`,
};
const primaryBtn = {
  padding: "10px 18px",
  borderRadius: 10,
  background: `linear-gradient(135deg, ${COLORS.cyan} 0%, ${COLORS.violet} 100%)`,
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
};
const secondaryBtn = {
  padding: "10px 16px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.05)",
  color: COLORS.text,
  fontSize: 12,
  fontWeight: 600,
  border: `1px solid ${COLORS.border}`,
  cursor: "pointer",
};
const actionBtn = {
  width: 40,
  height: 40,
  borderRadius: 10,
  background: `linear-gradient(135deg, ${COLORS.violet}30 0%, ${COLORS.violet}10 100%)`,
  border: `1px solid ${COLORS.violet}50`,
  color: "#fff",
  fontSize: 15,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};
