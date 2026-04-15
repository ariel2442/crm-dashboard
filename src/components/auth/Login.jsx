/**
 * Login — simple RTL login form that talks to WordPress via JWT.
 */
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { COLORS } from "../../constants/colors.js";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(username, password);
    } catch (e2) {
      setErr(e2.message || "התחברות נכשלה");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.bg,
        padding: 20,
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 380,
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: `linear-gradient(135deg, ${COLORS.cyan} 0%, ${COLORS.violet} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 900,
            color: "#fff",
            marginBottom: 18,
          }}
        >
          W
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: COLORS.text, marginBottom: 4 }}>
          התחברות ל-WebCRM
        </h1>
        <p style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 22 }}>
          הזן שם משתמש וסיסמה
        </p>

        <label style={labelStyle}>שם משתמש</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
          autoFocus
          required
        />

        <label style={labelStyle}>סיסמה</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />

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
            dangerouslySetInnerHTML={{ __html: err }}
          />
        )}

        <button
          type="submit"
          disabled={busy}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 10,
            background: busy
              ? COLORS.border
              : `linear-gradient(135deg, ${COLORS.cyan} 0%, ${COLORS.violet} 100%)`,
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            cursor: busy ? "wait" : "pointer",
            marginTop: 6,
          }}
        >
          {busy ? "מתחבר..." : "התחבר"}
        </button>
      </form>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#cbd5e1",
  marginBottom: 6,
  marginTop: 10,
};

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  fontSize: 13,
  marginBottom: 4,
  outline: "none",
  direction: "rtl",
};
