/**
 * QuoteModal — builds a quote for a lead, computes totals, saves to WP,
 * and opens a printable contract HTML in a new window.
 *
 * Stage 2 scope. Stage 3 adds Green API send, stage 4 adds iCount payment link.
 */
import { useState, useMemo } from "react";
import { COLORS } from "../../constants/colors.js";
import {
  createQuote,
  computeTotals,
  DEFAULT_VAT_RATE,
} from "../../api/quotes.js";
import { openContractWindow } from "../../contracts/templates.js";

const formatMoney = (n) =>
  new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(n || 0);

const emptyRow = () => ({ description: "", quantity: 1, price: 0 });

export default function QuoteModal({ lead, onClose, onSaved }) {
  const [items, setItems] = useState([emptyRow()]);
  const [vatRate, setVatRate] = useState(DEFAULT_VAT_RATE);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [savedQuote, setSavedQuote] = useState(null);

  const totals = useMemo(
    () => computeTotals(items, vatRate),
    [items, vatRate]
  );

  const updateRow = (idx, patch) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    );
  };

  const addRow = () => setItems((prev) => [...prev, emptyRow()]);

  const removeRow = (idx) => {
    setItems((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev
    );
  };

  const canSave =
    items.length > 0 &&
    items.every((it) => it.description.trim() && Number(it.price) > 0);

  const save = async () => {
    setBusy(true);
    setErr("");
    try {
      const q = await createQuote({
        title: `הצעה ל${lead.title}`,
        leadId: lead.id,
        clientName: lead.title,
        serviceType: lead.meta.service_type || "אחר",
        items,
        vatRate,
        notes,
      });
      setSavedQuote(q);
      onSaved?.(q);
    } catch (e) {
      setErr(e.message || "שגיאה בשמירת ההצעה");
    } finally {
      setBusy(false);
    }
  };

  const showContract = () => {
    openContractWindow({
      clientName: lead.title,
      serviceType: lead.meta.service_type || "אחר",
      items,
      totals: { ...totals, vatRate },
      quoteNumber: savedQuote ? `#${savedQuote.id}` : "טיוטה",
      notes,
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: 28,
          maxWidth: 720,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div style={{ fontSize: 30 }}>💰</div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: COLORS.text,
                  marginTop: 6,
                }}
              >
                הצעת מחיר — {lead.title}
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: COLORS.textMuted,
                  marginTop: 4,
                }}
              >
                סוג שירות: {lead.meta.service_type || "—"} · טלפון:{" "}
                {lead.meta.phone || "—"}
              </p>
            </div>
            <button onClick={onClose} style={closeBtn} title="סגור">
              ✕
            </button>
          </div>
        </div>

        {/* Items table */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            overflow: "hidden",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 2.5fr) 60px 110px 110px 40px",
              gap: 8,
              padding: "10px 14px",
              background: "rgba(255,255,255,0.03)",
              fontSize: 11,
              fontWeight: 700,
              color: COLORS.textMuted,
              borderBottom: `1px solid ${COLORS.border}`,
            }}
          >
            <div>תיאור</div>
            <div style={{ textAlign: "center" }}>כמות</div>
            <div style={{ textAlign: "center" }}>מחיר יח׳</div>
            <div style={{ textAlign: "center" }}>סה״כ</div>
            <div />
          </div>

          {items.map((it, idx) => {
            const rowTotal = Number(it.quantity || 0) * Number(it.price || 0);
            return (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(0, 2.5fr) 60px 110px 110px 40px",
                  gap: 8,
                  padding: "10px 14px",
                  borderBottom: `1px solid ${COLORS.border}`,
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  placeholder="תיאור הפריט"
                  value={it.description}
                  onChange={(e) =>
                    updateRow(idx, { description: e.target.value })
                  }
                  style={rowInput}
                />
                <input
                  type="number"
                  min="0"
                  value={it.quantity}
                  onChange={(e) =>
                    updateRow(idx, {
                      quantity: Number(e.target.value) || 0,
                    })
                  }
                  style={{ ...rowInput, textAlign: "center" }}
                />
                <input
                  type="number"
                  min="0"
                  value={it.price}
                  onChange={(e) =>
                    updateRow(idx, { price: Number(e.target.value) || 0 })
                  }
                  style={{ ...rowInput, textAlign: "center" }}
                />
                <div
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: COLORS.cyan,
                  }}
                >
                  {formatMoney(rowTotal)}
                </div>
                <button
                  onClick={() => removeRow(idx)}
                  disabled={items.length === 1}
                  style={removeBtn}
                  title="הסר שורה"
                >
                  ✕
                </button>
              </div>
            );
          })}

          <div style={{ padding: 10 }}>
            <button onClick={addRow} style={addRowBtn}>
              + הוסף פריט
            </button>
          </div>
        </div>

        {/* Totals */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 14,
          }}
        >
          <div style={totalRow}>
            <span style={{ color: COLORS.textMuted }}>סכום ביניים</span>
            <span style={{ color: COLORS.text, fontWeight: 700 }}>
              {formatMoney(totals.subtotal)}
            </span>
          </div>
          <div style={totalRow}>
            <span style={{ color: COLORS.textMuted }}>
              מע״מ{" "}
              <input
                type="number"
                value={vatRate}
                min="0"
                max="100"
                onChange={(e) => setVatRate(Number(e.target.value) || 0)}
                style={{
                  width: 44,
                  background: "transparent",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 6,
                  color: COLORS.text,
                  padding: "2px 6px",
                  textAlign: "center",
                  fontSize: 11,
                  marginRight: 4,
                }}
              />
              %
            </span>
            <span style={{ color: COLORS.text, fontWeight: 700 }}>
              {formatMoney(totals.vatAmount)}
            </span>
          </div>
          <div
            style={{
              ...totalRow,
              borderTop: `2px solid ${COLORS.cyan}40`,
              marginTop: 8,
              paddingTop: 10,
              fontSize: 16,
            }}
          >
            <span style={{ color: COLORS.text, fontWeight: 800 }}>
              סה״כ לתשלום
            </span>
            <span style={{ color: COLORS.cyan, fontWeight: 900 }}>
              {formatMoney(totals.total)}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>הערות להצעה (לא חובה)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="תנאים מיוחדים, הסתייגויות, לוח זמנים מותאם..."
            style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
          />
        </div>

        {err && (
          <div
            style={{
              background: "rgba(244,63,94,0.1)",
              color: COLORS.rose,
              border: `1px solid ${COLORS.rose}40`,
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 12,
              marginBottom: 12,
            }}
          >
            {err}
          </div>
        )}

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            borderTop: `1px solid ${COLORS.border}`,
            paddingTop: 14,
          }}
        >
          {!savedQuote ? (
            <>
              <button
                onClick={save}
                disabled={busy || !canSave}
                style={{
                  ...primaryBtn,
                  opacity: busy || !canSave ? 0.5 : 1,
                  cursor: busy || !canSave ? "not-allowed" : "pointer",
                }}
              >
                {busy ? "שומר..." : "💾 שמור הצעה"}
              </button>
              <button onClick={showContract} style={secondaryBtn}>
                👁 תצוגה מקדימה של חוזה
              </button>
              <button onClick={onClose} style={ghostBtn}>
                ביטול
              </button>
            </>
          ) : (
            <>
              <div
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  background: "rgba(16,185,129,0.1)",
                  color: COLORS.emerald,
                  border: `1px solid ${COLORS.emerald}40`,
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                ✓ הצעה #{savedQuote.id} נשמרה
              </div>
              <button onClick={showContract} style={primaryBtn}>
                📄 פתח חוזה
              </button>
              <button
                disabled
                style={{ ...secondaryBtn, opacity: 0.5 }}
                title="יתווסף בשלב 3 — Green API"
              >
                📱 שלח לוואטסאפ
              </button>
              <button
                disabled
                style={{ ...secondaryBtn, opacity: 0.5 }}
                title="יתווסף בשלב 4 — iCount"
              >
                💳 צור קישור תשלום
              </button>
              <button onClick={onClose} style={ghostBtn}>
                סגור
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const rowInput = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
  fontSize: 12,
  outline: "none",
  direction: "rtl",
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

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#cbd5e1",
  marginBottom: 6,
};

const totalRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "5px 0",
  fontSize: 13,
  alignItems: "center",
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

const ghostBtn = {
  padding: "10px 14px",
  borderRadius: 10,
  background: "transparent",
  color: COLORS.textMuted,
  fontSize: 12,
  fontWeight: 600,
  border: `1px solid ${COLORS.border}`,
  cursor: "pointer",
};

const addRowBtn = {
  width: "100%",
  padding: "9px 14px",
  borderRadius: 8,
  background: "rgba(8,145,178,0.08)",
  color: COLORS.cyan,
  fontSize: 12,
  fontWeight: 700,
  border: `1px dashed ${COLORS.cyan}60`,
  cursor: "pointer",
};

const removeBtn = {
  width: 30,
  height: 30,
  borderRadius: 7,
  background: "rgba(244,63,94,0.1)",
  color: COLORS.rose,
  border: `1px solid ${COLORS.rose}40`,
  fontSize: 12,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const closeBtn = {
  width: 32,
  height: 32,
  borderRadius: 8,
  background: "rgba(255,255,255,0.05)",
  color: COLORS.text,
  border: `1px solid ${COLORS.border}`,
  fontSize: 14,
  cursor: "pointer",
};
