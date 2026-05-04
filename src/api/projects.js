import { api } from "./client.js";

export async function listProjects() {
  const data = await api.get("projects-list");
  return data.projects;
}

export async function saveProject(project) {
  const data = await api.post("project-save", project);
  return data.project;
}

export async function deleteProject(id) {
  return api.post("project-delete", { id });
}
