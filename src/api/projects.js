/**
 * Projects API — WordPress "project" Custom Post Type.
 * RLS: clients only see their own (enforced server-side by crm-backend.php).
 */
import { WP_API, TOKEN_KEY } from "./config.js";
import { api } from "./client.js";

const META_FIELDS = [
  "client_name",
  "business_type",
  "phone",
  "email",
  "website_url",
  "notes",
  "status",
];

const emptyMeta = () =>
  META_FIELDS.reduce((acc, k) => ({ ...acc, [k]: "" }), {});

const normalize = (p) => ({
  id: p.id,
  title: p.title?.rendered || p.title || "",
  content: p.content?.rendered || "",
  authorId: p.author,
  date: p.date,
  modified: p.modified,
  meta: { ...emptyMeta(), ...(p.meta || {}) },
  featuredMedia: p.featured_media || 0,
});

export async function listProjects() {
  const data = await api.get("/projects?per_page=100&_embed");
  return data.map(normalize);
}

export async function getProject(id) {
  const data = await api.get(`/projects/${id}?_embed`);
  return normalize(data);
}

export async function createProject({ title, meta = {}, content = "" }) {
  const data = await api.post("/projects", {
    title,
    content,
    status: "publish",
    meta: { ...emptyMeta(), ...meta },
  });
  return normalize(data);
}

export async function updateProject(id, { title, meta, content }) {
  const body = {};
  if (title !== undefined) body.title = title;
  if (content !== undefined) body.content = content;
  if (meta !== undefined) body.meta = meta;
  const data = await api.put(`/projects/${id}`, body);
  return normalize(data);
}

export async function deleteProject(id) {
  return api.del(`/projects/${id}?force=true`);
}

/**
 * Upload a File object to the WP Media Library and attach it to a project.
 * Uses raw fetch because multipart needs a browser-generated boundary.
 */
export async function uploadFileToProject(file, projectId) {
  const token = localStorage.getItem(TOKEN_KEY);
  const form = new FormData();
  form.append("file", file);
  if (projectId) form.append("post", String(projectId));

  const res = await fetch(`${WP_API}/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Upload failed (${res.status})`);
  }
  return res.json();
}

export async function listProjectMedia(projectId) {
  return api.get(`/media?parent=${projectId}&per_page=100`);
}
