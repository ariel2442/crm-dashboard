/**
 * FinanceDetails - Detailed Income & Expense Ledger with Invoice Preview
 */
import { useState } from "react";
import { COLORS } from "../../constants/colors.js";
import { FINANCE_ITEMS } from "../../data/mock-data.js";

const PAY_ICONS = {
  "אשראי": "💳",
  "מזומן": "💵",
  "העברה בנקאית": "🏦",
  "הוראת קבע": "🔄",
};

const CATS = ["הכל", "עסקאות", "תפעול", "שיווק", "תוכנה"];

// Determine if file is an image or PDF based on extension
function fileType(filename) {
  if (!filename) return null;
  const ext = filename.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return "other";
}

function InvoiceFileViewer({ invoiceFile, invoiceNum }) {
  const [imgError, setImgError] = useState(false);
  const type = fileType(invoiceFile);
  const src = `/invoices/${invoiceFile}`;

  if (!invoiceFile) {
    return (
      <div style={{ background: "#f8fafc", borderRadius: 10, padding: "28px 0", textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📎</div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>לא צורף קובץ חשבונית</div>
        <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 4 }}>
          הוסף קובץ לתיקיית /public/invoices/
        </div>
      </div>
    );
  }

  if (type === "image" && !imgError) {
    return (
      <div style={{ marginBottom: 20, borderRadius: 10, overflow: "hidden", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
        <img
          src={src}
          alt={invoiceNum}
          onError={() => setImgError(true)}
          style={{ width: "100%", maxHeight: 320, objectFit: "contain", display: "block" }}
        />
      </div>
    );
  }

  if (type === "pdf" || (type === "image" && imgError)) {
    return (
      <div style={{ marginBottom: 20 }}>
        {type === "pdf" ? (
          <iframe
            src={src}
            title={invoiceNum}
            style={{ width: "100%", height: 300, border: "1px solid #e2e8f0", borderRadius: 10, background: "#f8fafc" }}
          />
        ) : (
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "28px 0", textAlign: "center", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>לא ניתן לטעון את הקובץ</div>
            <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 4 }}>{invoiceFile}</div>
          </div>
        )}
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: 8,
            fontSize: 12,
            color: "#6366f1",
            textDecoration: "none",
          }}
        >
          🔗 פתח בחלון חדש
        </a>
      </div>
    );
  }

  return null;
}

function InvoicesGallery({ onClose, onOpen }) {
  const [search, setSearch] = useState("");
  const filtered = FINANCE_ITEMS.filter((i) =>
    i.business.includes(search) || i.invoiceNum.includes(search)
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.card,
          borderRadius: 18,
          padding: 28,
          width: 700,
          maxHeight: "85vh",
          overflowY: "auto",
          color: COLORS.text,
          direction: "rtl",
          fontFamily: "'Rubik', sans-serif",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: COLORS.text }}>📁 תיקיית חשבוניות</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
              {FINANCE_ITEMS.length} חשבוניות · /public/invoices/
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: COLORS.border,
              border: "none",
              borderRadius: 8,
              width: 30,
              height: 30,
              fontSize: 16,
              cursor: "pointer",
              color: COLORS.textSub,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש לפי שם עסק או מספר חשבונית..."
          style={{
            width: "100%",
            background: COLORS.bg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: "8px 14px",
            color: COLORS.text,
            fontSize: 13,
            marginBottom: 18,
            direction: "rtl",
            fontFamily: "'Rubik', sans-serif",
            boxSizing: "border-box",
          }}
        />

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
          }}
        >
          {filtered.map((item) => {
            const isIncome = item.type === "הכנסה";
            const type = fileType(item.invoiceFile);
            const src = `/invoices/${item.invoiceFile}`;

            return (
              <div
                key={item.id}
                onClick={() => { onClose(); onOpen(item); }}
                style={{
                  background: COLORS.bg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.violet)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    height: 120,
                    background: COLORS.card,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {type === "image" ? (
                    <img
                      src={src}
                      alt={item.invoiceNum}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    style={{
                      display: type === "image" ? "none" : "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <div style={{ fontSize: 36 }}>{type === "pdf" ? "📄" : "📎"}</div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted }}>
                      {item.invoiceFile ? item.invoiceFile.split(".").pop().toUpperCase() : "—"}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.text, marginBottom: 2 }}>
                    {item.invoiceNum}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{item.business}</div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: isIncome ? COLORS.emerald : COLORS.rose,
                      }}
                    >
                      {isIncome ? "+" : "-"}₪{item.amount.toLocaleString("he-IL")}
                    </span>
                    <span style={{ fontSize: 10, color: COLORS.textMuted }}>{item.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: COLORS.textMuted, fontSize: 13 }}>
            לא נמצאו חשבוניות
          </div>
        )}
      </div>
    </div>
  );
}

function InvoiceModal({ item, onClose }) {
  const isIncome = item.type === "הכנסה";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 36,
          width: 500,
          maxHeight: "90vh",
          overflowY: "auto",
          color: "#111",
          direction: "rtl",
          fontFamily: "'Rubik', sans-serif",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "#f1f5f9",
            border: "none",
            borderRadius: 8,
            width: 30,
            height: 30,
            fontSize: 16,
            cursor: "pointer",
            color: "#475569",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>

        {/* Invoice Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
              {isIncome ? "חשבונית מס" : "קבלה / הוצאה"}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#0f172a" }}>{item.invoiceNum}</div>
          </div>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: isIncome
                ? "linear-gradient(135deg,#059669,#10b981)"
                : "linear-gradient(135deg,#e11d48,#f43f5e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            {isIncome ? "📈" : "📉"}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#e2e8f0", marginBottom: 20 }} />

        {/* Actual Invoice File */}
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10, letterSpacing: 0.5 }}>
          קובץ חשבונית מקורי
        </div>
        <InvoiceFileViewer invoiceFile={item.invoiceFile} invoiceNum={item.invoiceNum} />

        {/* Details Grid */}
        <div style={{ height: 1, background: "#e2e8f0", marginBottom: 18 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px", marginBottom: 22 }}>
          {[
            { label: "שם עסק", val: item.business },
            { label: "תאריך", val: item.date },
            { label: "תיאור", val: item.desc },
            { label: "קטגוריה", val: item.cat },
            { label: "אמצעי תשלום", val: `${PAY_ICONS[item.payMethod] || ""} ${item.payMethod}` },
            {
              label: "סטטוס",
              val: item.paid ? "✅ בוצע" : "⏳ ממתין",
              color: item.paid ? "#059669" : "#d97706",
            },
          ].map((r, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3, letterSpacing: 0.5 }}>{r.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: r.color || "#0f172a" }}>{r.val}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#e2e8f0", marginBottom: 18 }} />

        {/* Amount */}
        <div
          style={{
            background: isIncome ? "#f0fdf4" : "#fff1f2",
            borderRadius: 12,
            padding: "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <div style={{ fontSize: 13, color: "#64748b" }}>סכום כולל</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: isIncome ? "#059669" : "#e11d48" }}>
            {isIncome ? "+" : "-"}₪{item.amount.toLocaleString("he-IL")}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          {item.invoiceFile && (
            <a
              href={`/invoices/${item.invoiceFile}`}
              download={item.invoiceFile}
              style={{
                flex: 1,
                padding: "10px 0",
                background: "#f1f5f9",
                border: "none",
                borderRadius: 10,
                color: "#475569",
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none",
                textAlign: "center",
                fontFamily: "'Rubik', sans-serif",
              }}
            >
              ⬇️ הורד קובץ
            </a>
          )}
          <button
            onClick={() => window.print()}
            style={{
              flex: 1,
              padding: "10px 0",
              background: "#0f172a",
              border: "none",
              borderRadius: 10,
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'Rubik', sans-serif",
            }}
          >
            🖨️ הדפס
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 0",
              background: "#f1f5f9",
              border: "none",
              borderRadius: 10,
              color: "#475569",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'Rubik', sans-serif",
            }}
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FinanceDetails() {
  const [typeFilter, setTypeFilter] = useState("הכל");
  const [catFilter, setCatFilter] = useState("הכל");
  const [paidFilter, setPaidFilter] = useState("הכל");
  const [invoiceItem, setInvoiceItem] = useState(null);
  const [showGallery, setShowGallery] = useState(false);

  const filtered = FINANCE_ITEMS.filter((i) => {
    const typeOk = typeFilter === "הכל" || i.type === typeFilter;
    const catOk = catFilter === "הכל" || i.cat === catFilter;
    const paidOk =
      paidFilter === "הכל" ||
      (paidFilter === "בוצע" && i.paid) ||
      (paidFilter === "ממתין" && !i.paid);
    return typeOk && catOk && paidOk;
  });

  const totalIncome = FINANCE_ITEMS.filter((i) => i.type === "הכנסה").reduce((a, b) => a + b.amount, 0);
  const totalExpense = FINANCE_ITEMS.filter((i) => i.type === "הוצאה").reduce((a, b) => a + b.amount, 0);
  const pending = FINANCE_ITEMS.filter((i) => !i.paid).reduce((a, b) => a + b.amount, 0);

  const FilterBtn = ({ active, onClick, children, color }) => (
    <button
      onClick={onClick}
      style={{
        padding: "5px 14px",
        borderRadius: 20,
        border: `1px solid ${active ? (color || COLORS.cyan) : COLORS.border}`,
        background: active ? (color || COLORS.cyan) + "18" : "transparent",
        color: active ? (color || COLORS.cyan) : COLORS.textMuted,
        fontSize: 12,
        fontWeight: active ? 700 : 400,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>פירוט הכנסות והוצאות 📊</h2>
          <p style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>
            רשימה מלאה · אמצעי תשלום · סטטוס · חשבוניות
          </p>
        </div>
        <button
          onClick={() => setShowGallery(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 18px",
            background: COLORS.violetDim,
            border: `1px solid ${COLORS.violet}40`,
            borderRadius: 12,
            color: COLORS.violet,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
            fontFamily: "'Rubik', sans-serif",
          }}
        >
          📁 תיקיית חשבוניות
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "סה״כ הכנסות", val: `₪${totalIncome.toLocaleString("he-IL")}`, color: COLORS.emerald, icon: "📈" },
          { label: "סה״כ הוצאות", val: `₪${totalExpense.toLocaleString("he-IL")}`, color: COLORS.rose, icon: "📉" },
          { label: "רווח נקי", val: `₪${(totalIncome - totalExpense).toLocaleString("he-IL")}`, color: COLORS.cyan, icon: "💎" },
          { label: "ממתין לגבייה/תשלום", val: `₪${pending.toLocaleString("he-IL")}`, color: COLORS.amber, icon: "⏳" },
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
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: "14px 18px",
          marginBottom: 14,
          display: "flex",
          gap: 20,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: COLORS.textMuted, whiteSpace: "nowrap" }}>סוג:</span>
          {["הכל", "הכנסה", "הוצאה"].map((v) => (
            <FilterBtn
              key={v}
              active={typeFilter === v}
              onClick={() => setTypeFilter(v)}
              color={v === "הכנסה" ? COLORS.emerald : v === "הוצאה" ? COLORS.rose : COLORS.cyan}
            >
              {v}
            </FilterBtn>
          ))}
        </div>
        <div style={{ width: 1, height: 24, background: COLORS.border }} />
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: COLORS.textMuted, whiteSpace: "nowrap" }}>קטגוריה:</span>
          {CATS.map((v) => (
            <FilterBtn key={v} active={catFilter === v} onClick={() => setCatFilter(v)}>
              {v}
            </FilterBtn>
          ))}
        </div>
        <div style={{ width: 1, height: 24, background: COLORS.border }} />
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: COLORS.textMuted, whiteSpace: "nowrap" }}>סטטוס:</span>
          {["הכל", "בוצע", "ממתין"].map((v) => (
            <FilterBtn
              key={v}
              active={paidFilter === v}
              onClick={() => setPaidFilter(v)}
              color={v === "בוצע" ? COLORS.emerald : v === "ממתין" ? COLORS.amber : COLORS.cyan}
            >
              {v}
            </FilterBtn>
          ))}
        </div>
        <div style={{ marginRight: "auto", fontSize: 12, color: COLORS.textMuted }}>
          {filtered.length} פריטים
        </div>
      </div>

      {/* Table */}
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
              {["סוג", "שם עסק", "תיאור", "קטגוריה", "תאריך", "אמצעי תשלום", "סכום", "סטטוס", "חשבונית"].map((h) => (
                <th
                  key={h}
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
            {filtered.map((item, idx) => {
              const isIncome = item.type === "הכנסה";
              return (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: idx < filtered.length - 1 ? `1px solid ${COLORS.border}40` : "none",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.cardHov)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Type */}
                  <td style={{ padding: "13px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 700,
                        background: isIncome ? COLORS.emeraldDim : COLORS.roseDim,
                        color: isIncome ? COLORS.emerald : COLORS.rose,
                      }}
                    >
                      {isIncome ? "↑ הכנסה" : "↓ הוצאה"}
                    </span>
                  </td>

                  {/* Business */}
                  <td style={{ padding: "13px 16px", fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap" }}>
                    {item.business}
                  </td>

                  {/* Description */}
                  <td style={{ padding: "13px 16px", color: COLORS.textSub, fontSize: 12 }}>
                    {item.desc}
                  </td>

                  {/* Category */}
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ fontSize: 11, color: COLORS.textMuted, background: COLORS.border + "40", padding: "2px 8px", borderRadius: 8 }}>
                      {item.cat}
                    </span>
                  </td>

                  {/* Date */}
                  <td style={{ padding: "13px 16px", color: COLORS.textMuted, fontSize: 12, whiteSpace: "nowrap" }}>
                    {item.date}
                  </td>

                  {/* Payment Method */}
                  <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 12,
                        color: COLORS.textSub,
                      }}
                    >
                      {PAY_ICONS[item.payMethod] || "💳"} {item.payMethod}
                    </span>
                  </td>

                  {/* Amount */}
                  <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: isIncome ? COLORS.emerald : COLORS.rose,
                      }}
                    >
                      {isIncome ? "+" : "-"}₪{item.amount.toLocaleString("he-IL")}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "13px 16px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "4px 10px",
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 700,
                        background: item.paid ? COLORS.emeraldDim : COLORS.amberDim,
                        color: item.paid ? COLORS.emerald : COLORS.amber,
                      }}
                    >
                      {item.paid ? "✓ בוצע" : "⏳ ממתין"}
                    </span>
                  </td>

                  {/* Invoice Button */}
                  <td style={{ padding: "13px 16px" }}>
                    <button
                      onClick={() => setInvoiceItem(item)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "6px 12px",
                        background: COLORS.violetDim,
                        border: `1px solid ${COLORS.violet}40`,
                        borderRadius: 8,
                        color: COLORS.violet,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      📄 {item.invoiceNum}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: COLORS.textMuted, fontSize: 13 }}>
            אין פריטים תואמים לסינון
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {invoiceItem && (
        <InvoiceModal item={invoiceItem} onClose={() => setInvoiceItem(null)} />
      )}

      {/* Invoices Gallery */}
      {showGallery && (
        <InvoicesGallery
          onClose={() => setShowGallery(false)}
          onOpen={(item) => setInvoiceItem(item)}
        />
      )}
    </div>
  );
}
