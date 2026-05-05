import { api } from "./client.js";

export const LEAD_STATUSES = [
  { id: "new",         label: "לא נוצר קשר",      colorKey: "cyan" },
  { id: "in_progress", label: "בטיפול",            colorKey: "amber" },
  { id: "closing",     label: "רוצה לסגור",        colorKey: "violet" },
  { id: "won",         label: "שולם",              colorKey: "emerald" },
  { id: "lost",        label: "נסגר - לא רלוונטי", colorKey: "rose" },
];

export const getStatusMeta = (id) =>
  LEAD_STATUSES.find((s) => s.id === id) || LEAD_STATUSES[0];

export async function listLeads() {
  const data = await api.get("leads-list");
  return data.leads;
}

export async function getLead(id) {
  const data = await api.post("lead-get", { id });
  return data.lead;
}

export async function saveLead(lead) {
  const data = await api.post("lead-save", lead);
  return data.lead;
}

export async function createLead({ title, meta = {}, content = "" }) {
  return saveLead({ title, content, ...meta });
}

export async function updateLead(id, { title, meta, content }) {
  return saveLead({ id, title, content, ...meta });
}

export async function updateLeadStatus(id, status) {
  return saveLead({ id, status });
}

export async function deleteLead(id) {
  return api.post("lead-delete", { id });
}
