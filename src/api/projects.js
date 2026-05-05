import { api } from "./client.js";

export async function listProjects() {
  const data = await api.get("projects-list");
  return data.projects;
}

export async function saveProject(project) {
  const data = await api.post("project-save", project);
  return data.project;
}

export async function createProject({ title, meta = {}, content = "" }) {
  return saveProject({ title, content, ...meta });
}

export async function updateProject(id, { title, meta, content }) {
  return saveProject({ id, title, content, ...meta });
}

export async function deleteProject(id) {
  return api.post("project-delete", { id });
}

export async function uploadFileToProject() {
  throw new Error("העלאת קבצים תתמך בקרוב");
}

export async function listProjectMedia() {
  return [];
}
