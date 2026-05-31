import { useState, useEffect } from "react";
import { COLORS } from "../../constants/colors.js";
import { listProducts, saveProduct, deleteProduct } from "../../api/products.js";

const emptyProduct = () => ({
  id: null,
  name: "",
  description: "",
  price: 0,
  active: true,
});

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 9,
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${COLORS.border}`,
  color: COLORS.text,
  fontSize: 12,
  outline: "none",
  direction: "rtl",
  boxSizing: "border-box",
};


const primaryBtn = {
  padding: "9px 18px",
  borderRadius: 9,
  background: `linear-gradient(135deg, ${COLORS.cyan} 0%, ${COLORS.violet} 100%)`,
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "9px 16px",
  borderRadius: 9,
  background: "rgba(255,255,255,0.05)",
  color: COLORS.text,
  fontSize: 12,
  fontWeight: 600,
  border: `1px solid ${COLORS.border}`,
  cursor: "pointer",
};

const ghostBtn = {
  padding: "8px 14px",
  borderRadius: 8,
  background: "transparent",
  color: COLORS.textMuted,
  fontSize: 12,
  fontWeight: 600,
  border: `1px solid ${COLORS.border}`,
  cursor: "pointer",
};

const dangerBtn = {
  padding: "8px 14px",
  borderRadius: 8,
  background: "rgba(244,63,94,0.08)",
  color: COLORS.rose,
  fontSize: 12,
  fontWeight: 600,
  border: `1px solid ${COLORS.rose}30`,
  cursor: "pointer",
};

const formatMoney = (n) =>
  new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(n || 0);

function ProductForm({ product, onSave, onCancel, saving }) {
  const [form, setForm] = useState({ ...product });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const canSave = form.name.trim() && Number(form.price) >= 0;

  return (
    <div
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: "22px 24px",
        marginBottom: 16,
      }}
    >
      <h3
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: COLORS.text,
          marginBottom: 18,
          paddingBottom: 10,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        {form.id ? "✏️ עריכת מוצר" : "➕ מוצר חדש"}
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 5 }}>
            שם המוצר / שירות *
          </label>
          <input
            style={inputStyle}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="בניית אתר עסקי"
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 5 }}>
            מחיר ברירת מחדל (₪)
          </label>
          <input
            type="number"
            min="0"
            style={inputStyle}
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, marginBottom: 5 }}>
          תיאור קצר
        </label>
        <input
          style={inputStyle}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="תיאור קצר שיופיע בבחירת מוצר בהצעת מחיר"
        />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => onSave(form)}
          disabled={saving || !canSave}
          style={{ ...primaryBtn, opacity: saving || !canSave ? 0.5 : 1, cursor: saving || !canSave ? "not-allowed" : "pointer" }}
        >
          {saving ? "שומר..." : "💾 שמור"}
        </button>
        <button onClick={onCancel} style={ghostBtn}>
          ביטול
        </button>
      </div>
    </div>
  );
}

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    setLoading(true);
    listProducts()
      .then(setProducts)
      .catch(() => setMsg("שגיאה בטעינת המוצרים"))
      .finally(() => setLoading(false));
  };

  const handleSave = async (form) => {
    setSaving(true);
    setMsg("");
    try {
      const saved = await saveProduct(form);
      if (form.id) {
        setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      } else {
        setProducts((prev) => [...prev, saved]);
      }
      setEditing(null);
      setMsg("✓ המוצר נשמר בהצלחה");
      setTimeout(() => setMsg(""), 3000);
    } catch (e) {
      setMsg("שגיאה: " + (e.message || "נסה שוב"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setConfirmDelete(null);
      setMsg("✓ המוצר נמחק");
      setTimeout(() => setMsg(""), 3000);
    } catch (e) {
      setMsg("שגיאה במחיקה: " + (e.message || "נסה שוב"));
    }
  };

  return (
    <div style={{ overflowY: "auto", height: "100%", padding: "0 24px" }}>
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 0", direction: "rtl" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>📦 מוצרים ושירותים</h2>
          <p style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
            הגדר את המוצרים והשירותים שלך · מחירים · תנאי הסכם · יופיעו בבחירת פריט בהצעת מחיר
          </p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(emptyProduct())} style={primaryBtn}>
            ➕ מוצר חדש
          </button>
        )}
      </div>

      {/* Feedback msg */}
      {msg && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 9,
            background: msg.startsWith("✓") ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)",
            color: msg.startsWith("✓") ? COLORS.emerald : COLORS.rose,
            border: `1px solid ${msg.startsWith("✓") ? COLORS.emerald : COLORS.rose}40`,
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          {msg}
        </div>
      )}

      {/* Edit / Add form */}
      {editing && (
        <ProductForm
          product={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}

      {/* Products list */}
      {loading ? (
        <div style={{ color: COLORS.textMuted, fontSize: 13, padding: 20, textAlign: "center" }}>
          טוען מוצרים...
        </div>
      ) : products.length === 0 && !editing ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            color: COLORS.textMuted,
            background: COLORS.card,
            borderRadius: 14,
            border: `1px dashed ${COLORS.border}`,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>
            אין מוצרים עדיין
          </p>
          <p style={{ fontSize: 12, marginBottom: 20 }}>הוסף מוצר ראשון כדי להתחיל</p>
          <button onClick={() => setEditing(emptyProduct())} style={primaryBtn}>
            ➕ הוסף מוצר ראשון
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                opacity: p.active === false ? 0.5 : 1,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 11,
                  background: `linear-gradient(135deg, ${COLORS.cyan}20 0%, ${COLORS.violet}20 100%)`,
                  border: `1px solid ${COLORS.cyan}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                🛒
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: COLORS.text }}>
                    {p.name}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: COLORS.cyan,
                      background: `${COLORS.cyan}15`,
                      borderRadius: 6,
                      padding: "2px 8px",
                    }}
                  >
                    {formatMoney(p.price)}
                  </span>
                </div>
                {p.description && (
                  <p style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>
                    {p.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => setEditing({ ...p })}
                  style={secondaryBtn}
                  title="ערוך"
                >
                  ✏️ ערוך
                </button>
                {confirmDelete === p.id ? (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: COLORS.rose }}>בטוח?</span>
                    <button onClick={() => handleDelete(p.id)} style={dangerBtn}>
                      כן, מחק
                    </button>
                    <button onClick={() => setConfirmDelete(null)} style={ghostBtn}>
                      ביטול
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(p.id)}
                    style={dangerBtn}
                    title="מחק"
                  >
                    🗑
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
