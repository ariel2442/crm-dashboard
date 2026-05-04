/**
 * SettingsAutomations — admin panel for all automation settings:
 * WhatsApp (Green API), GROW/Meshulam payments, Google Drive,
 * message templates, and automated reminders.
 */
import { useState, useEffect } from "react";
import { COLORS } from "../../constants/colors.js";
import {
  getAutomationSettings,
  saveAutomationSettings,
  testGrowConnection,
  runReminders,
} from "../../api/automations.js";

const Section = ({ title, children }) => (
  <div
    style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 14,
      padding: "20px 22px",
      marginBottom: 16,
    }}
  >
    <h3
      style={{
        fontSize: 13,
        fontWeight: 800,
        color: COLORS.text,
        marginBottom: 16,
        paddingBottom: 10,
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      {title}
    </h3>
    {children}
  </div>
);

const Field = ({ label, hint, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label
      style={{
        display: "block",
        fontSize: 11,
        fontWeight: 600,
        color: COLORS.textMuted,
        marginBottom: 5,
      }}
    >
      {label}
      {hint && (
        <span style={{ fontWeight: 400, marginRight: 6, opacity: 0.7 }}>
          — {hint}
        </span>
      )}
    </label>
    {children}
  </div>
);

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

const textareaStyle = {
  ...inputStyle,
  minHeight: 72,
  resize: "vertical",
  fontFamily: "inherit",
  lineHeight: 1.6,
};

const toggleStyle = (on) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  fontSize: 12,
  color: on ? COLORS.emerald : COLORS.textMuted,
  fontWeight: 600,
  userSelect: "none",
});

const dot = (on) => ({
  width: 36,
  height: 20,
  borderRadius: 10,
  background: on ? COLORS.emerald : "rgba(255,255,255,0.1)",
  position: "relative",
  transition: "background 0.2s",
  flexShrink: 0,
});

const dotInner = (on) => ({
  position: "absolute",
  top: 3,
  right: on ? 3 : undefined,
  left: on ? undefined : 3,
  width: 14,
  height: 14,
  borderRadius: "50%",
  background: "#fff",
  transition: "all 0.2s",
});

function Toggle({ value, onChange, label }) {
  return (
    <label style={toggleStyle(value)} onClick={() => onChange(!value)}>
      <div style={dot(value)}>
        <div style={dotInner(value)} />
      </div>
      {label}
    </label>
  );
}

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

export default function SettingsAutomations() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState("");
  const [growStatus, setGrowStatus] = useState("");
  const [reminderStatus, setReminderStatus] = useState("");

  useEffect(() => {
    getAutomationSettings()
      .then((r) => setSettings(r.settings))
      .catch(() => setMsg("שגיאה בטעינת הגדרות"))
      .finally(() => setLoading(false));
  }, []);

  const set = (key, value) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      await saveAutomationSettings(settings);
      setMsg("✓ ההגדרות נשמרו");
      setTimeout(() => setMsg(""), 3000);
    } catch (e) {
      setMsg("שגיאה: " + (e.message || "נסה שוב"));
    } finally {
      setSaving(false);
    }
  };

  const testGrow = async () => {
    setGrowStatus("בודק...");
    try {
      await testGrowConnection();
      setGrowStatus("✅ מחובר!");
    } catch (e) {
      setGrowStatus("❌ " + (e.message || "שגיאה"));
    }
  };

  const triggerReminders = async (type) => {
    setReminderStatus("מריץ...");
    try {
      const r = await runReminders(type);
      setReminderStatus(`✓ נשלחו ${r.sent} תזכורות מתוך ${r.processed} הצעות`);
    } catch (e) {
      setReminderStatus("❌ " + (e.message || "שגיאה"));
    }
  };

  if (loading) {
    return (
      <div style={{ color: COLORS.textMuted, fontSize: 13, padding: 20 }}>
        טוען הגדרות...
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "20px 0",
        direction: "rtl",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>
            ⚙️ הגדרות אוטומציות
          </h2>
          <p style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
            WhatsApp · תשלומים · Google Drive · תזכורות אוטומטיות
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          style={{ ...primaryBtn, opacity: saving ? 0.6 : 1 }}
        >
          {saving ? "שומר..." : "💾 שמור הכל"}
        </button>
      </div>

      {msg && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 9,
            background: msg.startsWith("✓")
              ? "rgba(16,185,129,0.1)"
              : "rgba(244,63,94,0.1)",
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

      {/* ── פרטי עסק ──────────────────────────────────────────── */}
      <Section title="🏢 פרטי עסק">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="שם עסק">
            <input style={inputStyle} value={settings.bizName || ""} onChange={(e) => set("bizName", e.target.value)} placeholder="מאסטר שיווק בע״מ" />
          </Field>
          <Field label="אימייל עסק">
            <input style={inputStyle} value={settings.bizEmail || ""} onChange={(e) => set("bizEmail", e.target.value)} placeholder="info@business.co.il" dir="ltr" />
          </Field>
          <Field label="טלפון עסק">
            <input style={inputStyle} value={settings.bizPhone || ""} onChange={(e) => set("bizPhone", e.target.value)} placeholder="050-0000000" />
          </Field>
          <Field label="פרטי בנק" hint="לתשלום בהעברה">
            <input style={inputStyle} value={settings.bizBank || ""} onChange={(e) => set("bizBank", e.target.value)} placeholder="בנק לאומי | סניף 123 | חשבון 456789" />
          </Field>
        </div>
        <Field label="URL בסיס האתר" hint="לקישורים בהצעות מחיר">
          <input style={inputStyle} value={settings.baseUrl || ""} onChange={(e) => set("baseUrl", e.target.value)} placeholder="https://crm.ariel-azulay.co.il" dir="ltr" />
        </Field>
      </Section>

      {/* ── WhatsApp ───────────────────────────────────────────── */}
      <Section title="📱 WhatsApp — Green API">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Instance ID">
            <input style={inputStyle} value={settings.greenApiInstance || ""} onChange={(e) => set("greenApiInstance", e.target.value)} placeholder="1234567890" dir="ltr" />
          </Field>
          <Field label="API Token">
            <input style={inputStyle} type="password" value={settings.greenApiToken || ""} onChange={(e) => set("greenApiToken", e.target.value)} placeholder="••••••••••••••" dir="ltr" />
          </Field>
        </div>
        <Field label="טלפון נציג מכירות" hint="יקבל התראות על צפיות וחתימות">
          <input style={inputStyle} value={settings.salesRepPhone || ""} onChange={(e) => set("salesRepPhone", e.target.value)} placeholder="050-0000000" />
        </Field>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
          <Toggle value={!!settings.autoSendClient}    onChange={(v) => set("autoSendClient", v)}    label="שלח ללקוח בשליחה" />
          <Toggle value={!!settings.autoRepView}       onChange={(v) => set("autoRepView", v)}       label="התראה לנציג על צפייה" />
          <Toggle value={!!settings.autoRepSign}       onChange={(v) => set("autoRepSign", v)}       label="התראה לנציג על חתימה" />
          <Toggle value={!!settings.autoClientPayment} onChange={(v) => set("autoClientPayment", v)} label="שלח תשלום ללקוח בחתימה" />
        </div>
      </Section>

      {/* ── GROW / Meshulam ───────────────────────────────────── */}
      <Section title="💳 תשלומים — GROW / Meshulam">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="User ID">
            <input style={inputStyle} value={settings.growUserId || ""} onChange={(e) => set("growUserId", e.target.value)} placeholder="12345" dir="ltr" />
          </Field>
          <Field label="Page Code">
            <input style={inputStyle} value={settings.growPageCode || ""} onChange={(e) => set("growPageCode", e.target.value)} placeholder="abc123" dir="ltr" />
          </Field>
        </div>
        <Field label="Success URL" hint="לאחר תשלום מוצלח">
          <input style={inputStyle} value={settings.growSuccessUrl || ""} onChange={(e) => set("growSuccessUrl", e.target.value)} placeholder="https://..." dir="ltr" />
        </Field>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 6 }}>
          <Toggle value={!!settings.growSandbox} onChange={(v) => set("growSandbox", v)} label="מצב Sandbox (טסטים)" />
          <button onClick={testGrow} style={secondaryBtn}>
            🔌 בדוק חיבור
          </button>
          {growStatus && (
            <span style={{ fontSize: 12, color: growStatus.startsWith("✅") ? COLORS.emerald : COLORS.rose }}>
              {growStatus}
            </span>
          )}
        </div>
      </Section>

      {/* ── Google Drive ──────────────────────────────────────── */}
      <Section title="📁 Google Drive">
        <Toggle value={!!settings.autoDrive} onChange={(v) => set("autoDrive", v)} label="העלה הסכמים חתומים אוטומטית" />
        <div style={{ marginTop: 12 }}>
          <Field label="Folder ID" hint="ID של תיקיית Google Drive">
            <input style={inputStyle} value={settings.driveFolderId || ""} onChange={(e) => set("driveFolderId", e.target.value)} placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms" dir="ltr" />
          </Field>
          <Field label="Service Account JSON" hint="JSON מלא של חשבון שירות Google">
            <textarea
              style={{ ...textareaStyle, minHeight: 100, fontSize: 10, direction: "ltr" }}
              value={settings.driveServiceAccount || ""}
              onChange={(e) => set("driveServiceAccount", e.target.value)}
              placeholder={'{"type":"service_account","project_id":"...","private_key":"..."}'}
            />
          </Field>
        </div>
      </Section>

      {/* ── תזכורות אוטומטיות ──────────────────────────────── */}
      <Section title="⏰ תזכורות אוטומטיות">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div
            style={{
              padding: 14,
              background: "rgba(255,255,255,0.02)",
              borderRadius: 10,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <Toggle
              value={!!settings.reminderNotOpenEnabled}
              onChange={(v) => set("reminderNotOpenEnabled", v)}
              label="תזכורת: לא פתח"
            />
            <p style={{ fontSize: 11, color: COLORS.textMuted, margin: "6px 0 10px" }}>
              שולחת WhatsApp אם הלקוח לא פתח את ההצעה
            </p>
            <Field label="שעות להמתנה">
              <input
                type="number"
                min="1"
                style={{ ...inputStyle, width: 100 }}
                value={settings.reminderNotOpenHours || 24}
                onChange={(e) => set("reminderNotOpenHours", Number(e.target.value))}
              />
            </Field>
          </div>
          <div
            style={{
              padding: 14,
              background: "rgba(255,255,255,0.02)",
              borderRadius: 10,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <Toggle
              value={!!settings.reminderNotSignedEnabled}
              onChange={(v) => set("reminderNotSignedEnabled", v)}
              label="תזכורת: לא חתם"
            />
            <p style={{ fontSize: 11, color: COLORS.textMuted, margin: "6px 0 10px" }}>
              שולחת WhatsApp אם הלקוח צפה אך לא חתם
            </p>
            <Field label="שעות להמתנה">
              <input
                type="number"
                min="1"
                style={{ ...inputStyle, width: 100 }}
                value={settings.reminderNotSignedHours || 48}
                onChange={(e) => set("reminderNotSignedHours", Number(e.target.value))}
              />
            </Field>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={() => triggerReminders("all")}        style={primaryBtn}>▶ הרץ תזכורות עכשיו</button>
          <button onClick={() => triggerReminders("not-open")}   style={secondaryBtn}>⏩ לא פתח בלבד</button>
          <button onClick={() => triggerReminders("not-signed")} style={secondaryBtn}>⏩ לא חתם בלבד</button>
          {reminderStatus && (
            <span style={{ fontSize: 12, color: reminderStatus.startsWith("✓") ? COLORS.emerald : COLORS.rose }}>
              {reminderStatus}
            </span>
          )}
        </div>

        <div
          style={{
            marginTop: 12,
            padding: "10px 14px",
            background: "rgba(255,255,255,0.02)",
            borderRadius: 8,
            fontSize: 11,
            color: COLORS.textMuted,
          }}
        >
          💡 התזכורות רצות אוטומטית כל שעה דרך WP-Cron. אפשר גם להגדיר Cron חיצוני:
          <code
            style={{
              display: "block",
              marginTop: 6,
              padding: "6px 10px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 6,
              fontSize: 10,
              direction: "ltr",
              overflowX: "auto",
            }}
          >
            {`0 * * * * curl "${settings.baseUrl || "https://yoursite.co.il"}/wp-json/crm/v1/run-reminders?token=${settings.cronToken || "YOUR_TOKEN"}" -X POST`}
          </code>
        </div>

        <Field label="Cron Token" hint="לגישה מחוץ לאפליקציה (לא חובה)" >
          <input style={{ ...inputStyle, direction: "ltr" }} value={settings.cronToken || ""} onChange={(e) => set("cronToken", e.target.value)} placeholder="סיסמה סודית לקריאות Cron" />
        </Field>
      </Section>

      {/* ── תבניות הודעות ─────────────────────────────────── */}
      <Section title="✍️ תבניות הודעות WhatsApp">
        <p style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 14 }}>
          משתנים: <code>{"{name}"}</code> שם לקוח · <code>{"{num}"}</code> מספר הצעה · <code>{"{link}"}</code> קישור · <code>{"{total}"}</code> סכום · <code>{"{payLink}"}</code> קישור תשלום · <code>{"{bank}"}</code> פרטי בנק · <code>{"{hours}"}</code> שעות
        </p>
        {[
          ["msgSendClient",        "📤 שליחה ללקוח"],
          ["msgViewFirst",         "👁 צפייה ראשונה (לנציג)"],
          ["msgViewReturn",        "🔄 חזרה לצפות (לנציג)"],
          ["msgSignRep",           "✅ חתימה (לנציג)"],
          ["msgSignCredit",        "💳 חתימה + אשראי (ללקוח)"],
          ["msgSignBank",          "🏦 חתימה + בנק (ללקוח)"],
          ["msgReminderNotOpen",   "⏰ תזכורת: לא פתח"],
          ["msgReminderNotSigned", "⏰ תזכורת: לא חתם"],
        ].map(([key, label]) => (
          <Field key={key} label={label}>
            <textarea
              style={textareaStyle}
              value={settings[key] || ""}
              onChange={(e) => set(key, e.target.value)}
            />
          </Field>
        ))}
      </Section>

      <div style={{ textAlign: "center", paddingTop: 8 }}>
        <button
          onClick={save}
          disabled={saving}
          style={{ ...primaryBtn, padding: "12px 32px", fontSize: 14, opacity: saving ? 0.6 : 1 }}
        >
          {saving ? "שומר..." : "💾 שמור הכל"}
        </button>
      </div>
    </div>
  );
}
