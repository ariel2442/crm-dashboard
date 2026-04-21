import { useState } from "react";
import { getAllUsers, addUser, deleteUser, updateUserPassword } from "../../api/auth.js";
import { COLORS } from "../../constants/colors.js";

export default function UsersManager() {
  const [users, setUsers] = useState(getAllUsers);
  const [form, setForm] = useState({ username: "", password: "", name: "", role: "viewer" });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newPass, setNewPass] = useState("");

  const refresh = () => setUsers(getAllUsers());

  const handleAdd = (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    try {
      addUser(form);
      setForm({ username: "", password: "", name: "", role: "viewer" });
      setSuccess("משתמש נוסף בהצלחה");
      refresh();
    } catch (e2) {
      setErr(e2.message);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("למחוק משתמש זה?")) return;
    deleteUser(id);
    refresh();
  };

  const handleChangePass = (id) => {
    if (!newPass.trim()) return;
    updateUserPassword(id, newPass);
    setEditingId(null);
    setNewPass("");
    setSuccess("סיסמה עודכנה");
  };

  const roleLabel = (r) => r === "administrator" ? "מנהל" : "צופה";

  return (
    <div style={{ padding: 28, maxWidth: 700, margin: "0 auto" }}>
      <h2 style={{ color: COLORS.text, fontSize: 20, fontWeight: 800, marginBottom: 24 }}>
        ניהול משתמשים
      </h2>

      {/* Users Table */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, marginBottom: 28, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
              {["שם", "שם משתמש", "תפקיד", "פעולות"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", color: COLORS.textMuted, fontSize: 12, fontWeight: 600, textAlign: "right", borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={td}>{u.name}</td>
                <td style={td}>{u.username}</td>
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
      </div>

      {/* Add User Form */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ color: COLORS.text, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>הוסף משתמש</h3>
        <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={label}>שם מלא</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={input} />
          </div>
          <div>
            <label style={label}>שם משתמש</label>
            <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} style={input} />
          </div>
          <div>
            <label style={label}>סיסמה</label>
            <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={input} />
          </div>
          <div>
            <label style={label}>תפקיד</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={input}>
              <option value="viewer">צופה</option>
              <option value="administrator">מנהל</option>
            </select>
          </div>
          {err && <div style={{ gridColumn: "1/-1", color: "#f43f5e", fontSize: 12 }}>{err}</div>}
          {success && <div style={{ gridColumn: "1/-1", color: COLORS.cyan, fontSize: 12 }}>{success}</div>}
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

const td = { padding: "12px 16px", color: "#e2e8f0", fontSize: 13 };
const label = { display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 5 };
const input = { width: "100%", padding: "9px 12px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, outline: "none", direction: "rtl", boxSizing: "border-box" };
const miniInput = { padding: "5px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 12, outline: "none", width: 130 };
const btnSmall = (color) => ({ padding: "4px 10px", borderRadius: 6, background: `${color}22`, color, border: `1px solid ${color}44`, fontSize: 11, fontWeight: 600, cursor: "pointer" });
