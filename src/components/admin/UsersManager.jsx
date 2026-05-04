import { useState, useEffect } from "react";
import { getAllUsers, addUser, deleteUser, updateUserPassword, updateUser } from "../../api/users.js";
import { COLORS } from "../../constants/colors.js";

const EMPTY_FORM = { username: "", password: "", name: "", role: "viewer", phone: "", email: "" };

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newPass, setNewPass] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (e) {
      setErr("שגיאה בטעינת משתמשים: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const flash = (msg, isErr = false) => {
    if (isErr) { setErr(msg); setSuccess(""); }
    else { setSuccess(msg); setErr(""); }
    setTimeout(() => { setErr(""); setSuccess(""); }, 3000);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addUser(form);
      setForm(EMPTY_FORM);
      flash("משתמש נוסף בהצלחה ✓");
      load();
    } catch (e2) {
      flash(e2.message, true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("למחוק משתמש זה?")) return;
    await deleteUser(id);
    flash("משתמש נמחק");
    load();
  };

  const handleChangePass = async (id) => {
    if (!newPass.trim()) return;
    await updateUserPassword(id, newPass);
    setEditingId(null);
    setNewPass("");
    flash("סיסמה עודכנה ✓");
  };

  const roleLabel = (r) => r === "administrator" ? "מנהל" : "צופה";

  return (
    <div style={{ padding: 28, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ color: COLORS.text, fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
        ניהול משתמשים
      </h2>
      <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 28 }}>
        נתונים מסונכרנים בין כל המכשירים בזמן אמת
      </p>

      {/* Users Table */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 28, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 24, color: COLORS.textMuted, fontSize: 13 }}>טוען...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                {["שם", "משתמש", "טלפון", "אימייל", "תפקיד", "פעולות"].map((h) => (
                  <th key={h} style={{ padding: "12px 14px", color: COLORS.textMuted, fontSize: 11, fontWeight: 600, textAlign: "right", borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 24, color: COLORS.textMuted, fontSize: 13, textAlign: "center" }}>אין משתמשים עדיין</td></tr>
              )}
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={td}>{u.name}</td>
                  <td style={{ ...td, color: COLORS.textMuted }}>{u.username}</td>
                  <td style={{ ...td, color: COLORS.textMuted }}>{u.phone || "—"}</td>
                  <td style={{ ...td, color: COLORS.textMuted }}>{u.email || "—"}</td>
                  <td style={td}>
                    <span style={{ background: u.role === "administrator" ? "rgba(6,182,212,0.15)" : "rgba(148,163,184,0.1)", color: u.role === "administrator" ? COLORS.cyan : COLORS.textMuted, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                      {roleLabel(u.role)}
                    </span>
                  </td>
                  <td style={td}>
                    {editingId === u.id ? (
                      <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <input value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="סיסמה חדשה" style={miniInput} />
                        <button onClick={() => handleChangePass(u.id)} style={btnSmall(COLORS.cyan)}>שמור</button>
                        <button onClick={() => setEditingId(null)} style={btnSmall(COLORS.textMuted)}>ביטול</button>
                      </span>
                    ) : (
                      <span style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setEditingId(u.id)} style={btnSmall(COLORS.cyan)}>שנה סיסמה</button>
                        <button onClick={() => handleDelete(u.id)} style={btnSmall("#f43f5e")}>מחק</button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add User Form */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: COLORS.text, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>הוסף משתמש</h3>
        <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="שם מלא *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="שם משתמש *" value={form.username} onChange={(v) => setForm({ ...form, username: v })} required />
          <Field label="סיסמה *" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} required />
          <div>
            <label style={labelStyle}>תפקיד</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={inputStyle}>
              <option value="viewer">צופה</option>
              <option value="administrator">מנהל</option>
            </select>
          </div>
          <Field label="טלפון" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="אימייל" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />

          {err && <div style={{ gridColumn: "1/-1", color: "#f43f5e", fontSize: 12, padding: "8px 12px", background: "rgba(244,63,94,0.08)", borderRadius: 8 }}>{err}</div>}
          {success && <div style={{ gridColumn: "1/-1", color: COLORS.cyan, fontSize: 12, padding: "8px 12px", background: "rgba(6,182,212,0.08)", borderRadius: 8 }}>{success}</div>}

          <div style={{ gridColumn: "1/-1" }}>
            <button type="submit" style={{ padding: "10px 24px", borderRadius: 8, background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.violet})`, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
              הוסף משתמש
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
        required={required}
      />
    </div>
  );
}

const td = { padding: "11px 14px", color: "#e2e8f0", fontSize: 13 };
const labelStyle = { display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 5 };
const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, outline: "none", direction: "rtl", boxSizing: "border-box" };
const miniInput = { padding: "5px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 12, outline: "none", width: 130 };
const btnSmall = (color) => ({ padding: "4px 10px", borderRadius: 6, background: `${color}22`, color, border: `1px solid ${color}44`, fontSize: 11, fontWeight: 600, cursor: "pointer" });
