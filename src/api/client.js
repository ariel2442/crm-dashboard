/**
 * Thin fetch wrapper for the CRM PHP backend.
 * All requests go to api.php?action=X with a Bearer token.
 */
import { API_URL, TOKEN_KEY } from "./config.js";

export const getToken   = () => localStorage.getItem(TOKEN_KEY);
export const setToken   = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(action, body = null, method = "POST") {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `${API_URL}?action=${action}`;
  const res  = await fetch(url, {
    method,
    headers,
    ...(body !== null ? { body: JSON.stringify(body) } : {}),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok || data?.ok === false) {
    const err = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data   = data;
    throw err;
  }
  return data;
}

export const api = {
  get:  (action)       => request(action, null, "GET"),
  post: (action, body) => request(action, body, "POST"),
};

export async function login(email, password) {
  const data = await request("login", { email, password });
  setToken(data.token);
  return data;
}

export async function fetchCurrentUser() {
  return request("me", null, "GET");
}

export async function validateToken() {
  if (!getToken()) return false;
  try {
    await fetchCurrentUser();
    return true;
  } catch {
    clearToken();
    return false;
  }
}
