/**
 * Leads API — WordPress "lead" Custom Post Type.
 */
import { api } from "./client.js";

export const LEAD_STATUSES = [
  { id: "new", label: "לא נוצר קשר", colorKey: "cyan" },
  { id: "in_progress", label: "בטיפול", colorKey: "amber" },
  { id: "closing", label: "רוצה לסגור", colorKey: "violet" },
  { id: "won", label: "שולם", colorKey: "emerald" },
  { id: "lost", label: "נסגר - לא רלוונטי", colorKey: "rose" },
];

export const getStatusMeta = (id) =>
  LEAD_STATUSES.find((s) => s.id === id) || LEAD_STATUSES[0];

const META_KEYS = [
  "phone",
  "email",
  "service_type",
  "source",
  "notes",
  "status",
  "budget",
];

const emptyMeta = () =>
  META_KEYS.reduce((acc, k) => ({ ...acc, [k]: "" }), { status: "new" });

const normalize = (p) => ({
  id: p.id,
  title: p.title?.rendered || p.title || "",
  content: p.content?.rendered || "",
  authorId: p.author,
  date: p.date,
  modified: p.modified,
  meta: { ...emptyMeta(), ...(p.meta || {}) },
});

export async function listLeads() {
  const data = await api.get("/leads?per_page=100&orderby=date&order=desc");
  return data.map(normalize);
}

export async function createLead({ title, meta = {}, content = "" }) {
  const data = await api.post("/leads", {
    title,
    content,
    status: "publish",
    meta: { ...emptyMeta(), ...meta },
  });
  return normalize(data);
}

export async function updateLead(id, { title, meta, content }) {
  const body = {};
  if (title !== undefined) body.title = title;
  if (content !== undefined) body.content = content;
  if (meta !== undefined) body.meta = meta;
  const data = await api.put(`/leads/${id}`, body);
  return normalize(data);
}

export async function updateLeadStatus(id, status) {
  const data = await api.put(`/leads/${id}`, { meta: { status } });
  return normalize(data);
}

export async function deleteLead(id) {
  return api.del(`/leads/${id}?force=true`);
}
