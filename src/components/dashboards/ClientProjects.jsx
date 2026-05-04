/**
 * ClientProjects — real data from WordPress.
 * Admin sees + creates projects. Client sees only their own and uploads files.
 */
import { useEffect, useState } from "react";
import { COLORS } from "../../constants/colors.js";
import {
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadFileToProject,
  listProjectMedia,
} from "../../api/projects.js";
import SectionTitle from "../shared/SectionTitle.jsx";

const STATUS_OPTIONS = ["חדש", "בתהליך", "ממתין ללקוח", "הושלם"];

export default function ClientProjects() {
  const isAdmin = true;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await listProjects();
      setProjects(data);
      if (!selectedId && data.length) setSelectedId(data[0].id);
    } catch (e) {
      setErr(e.message || "שגיאה בטעינת הפרויקטים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = projects.find((p) => p.id === selectedId) || null;

  const onCreated = (proj) => {
    setProjects((prev) => [proj, ...prev]);
    setSelectedId(proj.id);
    setShowForm(false);
  };

  const onUpdated = (proj) => {
    setProjects((prev) => prev.map((p) => (p.id === proj.id ? proj : p)));
  };

  const onDelete = async (id) => {
    if (!confirm("למחוק את הפרויקט?")) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div
      className="fu"
      style={{ padding: 24, overflowY: "auto", height: "100%" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>
            {isAdmin ? "ניהול פרויקטים 🚀" : "הפרויקטים שלי 🚀"}
          </h2>
          <p
            style={{
              fontSize: 13,
              color: COLORS.textMuted,
              marginTop: 2,
            }}
          >
            {isAdmin
              ? "ניהול פרויקטי לקוחות — הוספה, עריכה והורדת חומרים"
              : "צפה והעלה חומרים לפרויקטים שלך"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            style={primaryBtn}
          >
            + פרויקט חדש
          </button>
        )}
      </div>

      {err && <ErrorBox message={err} />}
      {loading && <div style={{ color: COLORS.textMuted }}>טוען...</div>}

      {!loading && !projects.length && !showForm && (
        <EmptyState isAdmin={isAdmin} onCreate={() => setShowForm(true)} />
      )}

      {showForm && (
        <ProjectForm
          onCancel={() => setShowForm(false)}
          onSaved={onCreated}
        />
      )}

      {!!projects.length && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 14,
          }}
        >
          {/* List */}
          <div
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 14,
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            <SectionTitle sub={`${projects.length} סה״כ`}>רשימה</SectionTitle>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                style={{
                  width: "100%",
                  textAlign: "right",
                  padding: "10px 12px",
                  marginBottom: 6,
                  borderRadius: 10,
                  background:
                    p.id === selectedId
                      ? COLORS.cyan + "15"
                      : "rgba(255,255,255,0.02)",
                  border: `1px solid ${
                    p.id === selectedId ? COLORS.cyan + "60" : COLORS.border
                  }`,
                  color: COLORS.text,
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  {p.title || "ללא כותרת"}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.textMuted,
                    marginTop: 2,
                  }}
                >
                  {p.meta.client_name || "—"}
                  {p.meta.status && ` · ${p.meta.status}`}
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 20,
            }}
          >
            {selected ? (
              <ProjectDetail
                project={selected}
                canEdit={true}
                canDelete={isAdmin}
                onUpdated={onUpdated}
                onDelete={() => onDelete(selected.id)}
              />
            ) : (
              <div style={{ color: COLORS.textMuted, fontSize: 13 }}>
                בחר פרויקט מהרשימה
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Form ---------- */
function ProjectForm({ onCancel, onSaved, initial }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [meta, setMeta] = useState({
    client_name: initial?.meta?.client_name || "",
    business_type: initial?.meta?.business_type || "",
    phone: initial?.meta?.phone || "",
    email: initial?.meta?.email || "",
    website_url: initial?.meta?.website_url || "",
    notes: initial?.meta?.notes || "",
    status: initial?.meta?.status || "חדש",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const saved = initial
        ? await updateProject(initial.id, { title, meta })
        : await createProject({ title, meta });
      onSaved(saved);
    } catch (e2) {
      setErr(e2.message || "שגיאה בשמירה");
    } finally {
      setBusy(false);
    }
  };

  const field = (key, label, type = "text") => (
    <div style={{ marginBottom: 10 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={meta[key]}
        onChange={(e) => setMeta({ ...meta, [key]: e.target.value })}
        style={inputStyle}
      />
    </div>
  );

  return (
    <form
      onSubmit={submit}
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: 20,
        marginBottom: 14,
      }}
    >
      <SectionTitle>{initial ? "עריכת פרויקט" : "פרויקט חדש"}</SectionTitle>
      <div style={{ marginBottom: 10 }}>
        <label style={labelStyle}>שם הפרויקט *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
          required
          autoFocus
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {field("client_name", "שם לקוח")}
        {field("business_type", "סוג עסק")}
        {field("phone", "טלפון", "tel")}
        {field("email", "אימייל", "email")}
        {field("website_url", "אתר אינטרנט", "url")}
        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>סטטוס</label>
          <select
            value={meta.status}
            onChange={(e) => setMeta({ ...meta, status: e.target.value })}
            style={inputStyle}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={labelStyle}>הערות</label>
        <textarea
          value={meta.notes}
          onChange={(e) => setMeta({ ...meta, notes: e.target.value })}
          style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
        />
      </div>

      {err && <ErrorBox message={err} />}

      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <button type="submit" disabled={busy} style={primaryBtn}>
          {busy ? "שומר..." : initial ? "עדכן" : "צור פרויקט"}
        </button>
        <button type="button" onClick={onCancel} style={secondaryBtn}>
          ביטול
        </button>
      </div>
    </form>
  );
}

/* ---------- Detail + upload ---------- */
function ProjectDetail({ project, canEdit, canDelete, onUpdated, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  const loadMedia = async () => {
    try {
      const items = await listProjectMedia(project.id);
      setMedia(items);
    } catch {
      setMedia([]);
    }
  };

  useEffect(() => {
    loadMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  const onFilePick = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setUploadErr("");
    try {
      for (const f of files) {
        await uploadFileToProject(f, project.id);
      }
      await loadMedia();
    } catch (e2) {
      setUploadErr(e2.message || "שגיאה בהעלאה");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (editing) {
    return (
      <ProjectForm
        initial={project}
        onCancel={() => setEditing(false)}
        onSaved={(p) => {
          onUpdated(p);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 14,
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.text }}>
            {project.title}
          </h3>
          {project.meta.status && (
            <span
              style={{
                display: "inline-block",
                marginTop: 6,
                padding: "3px 10px",
                borderRadius: 20,
                background: COLORS.cyan + "20",
                color: COLORS.cyan,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {project.meta.status}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {canEdit && (
            <button onClick={() => setEditing(true)} style={secondaryBtn}>
              ערוך
            </button>
          )}
          {canDelete && (
            <button onClick={onDelete} style={dangerBtn}>
              מחק
            </button>
          )}
        </div>
      </div>

      <MetaRow label="שם לקוח" value={project.meta.client_name} />
      <MetaRow label="סוג עסק" value={project.meta.business_type} />
      <MetaRow label="טלפון" value={project.meta.phone} />
      <MetaRow label="אימייל" value={project.meta.email} />
      <MetaRow label="אתר" value={project.meta.website_url} />
      {project.meta.notes && (
        <div style={{ marginTop: 10 }}>
          <div style={metaLabel}>הערות</div>
          <div
            style={{
              color: COLORS.textSub,
              fontSize: 12,
              whiteSpace: "pre-wrap",
              marginTop: 4,
            }}
          >
            {project.meta.notes}
          </div>
        </div>
      )}

      {/* Media */}
      <div
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <SectionTitle sub={`${media.length} קבצים`}>חומרים</SectionTitle>
          {canEdit && (
            <label style={{ ...primaryBtn, display: "inline-block" }}>
              {uploading ? "מעלה..." : "+ העלה קבצים"}
              <input
                type="file"
                multiple
                onChange={onFilePick}
                disabled={uploading}
                style={{ display: "none" }}
              />
            </label>
          )}
        </div>

        {uploadErr && <ErrorBox message={uploadErr} />}

        {!media.length ? (
          <div style={{ color: COLORS.textMuted, fontSize: 12 }}>
            טרם הועלו חומרים
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {media.map((m) => (
              <a
                key={m.id}
                href={m.source_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  padding: 10,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.text,
                  fontSize: 11,
                  textDecoration: "none",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={m.title?.rendered || ""}
              >
                📎 {m.title?.rendered || m.slug}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Small helpers ---------- */
function MetaRow({ label, value }) {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        borderBottom: `1px dashed ${COLORS.border}`,
        fontSize: 12,
      }}
    >
      <span style={{ color: COLORS.textMuted }}>{label}</span>
      <span style={{ color: COLORS.text, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function EmptyState({ isAdmin, onCreate }) {
  return (
    <div
      style={{
        background: COLORS.card,
        border: `1px dashed ${COLORS.border}`,
        borderRadius: 14,
        padding: 40,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 36 }}>📁</div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>
        עדיין אין פרויקטים
      </h3>
      <p style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 4 }}>
        {isAdmin
          ? "צור את הפרויקט הראשון כדי להתחיל"
          : "פרויקטים שיוקצו אליך יופיעו כאן"}
      </p>
      {isAdmin && (
        <button
          onClick={onCreate}
          style={{ ...primaryBtn, marginTop: 14 }}
        >
          + פרויקט חדש
        </button>
      )}
    </div>
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

const metaLabel = {
  fontSize: 10,
  color: COLORS.textMuted,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 1,
};

const primaryBtn = {
  padding: "9px 16px",
  borderRadius: 10,
  background: `linear-gradient(135deg, ${COLORS.cyan} 0%, ${COLORS.violet} 100%)`,
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "9px 14px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.05)",
  color: COLORS.text,
  fontSize: 12,
  fontWeight: 600,
  border: `1px solid ${COLORS.border}`,
  cursor: "pointer",
};

const dangerBtn = {
  padding: "9px 14px",
  borderRadius: 10,
  background: "rgba(244,63,94,0.1)",
  color: COLORS.rose,
  fontSize: 12,
  fontWeight: 600,
  border: `1px solid ${COLORS.rose}40`,
  cursor: "pointer",
};
