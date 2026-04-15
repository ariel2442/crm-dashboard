/**
 * Thin fetch wrapper that attaches the JWT token and handles errors.
 */
import { JWT_API, WP_API, TOKEN_KEY } from "./config.js";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(url, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.message || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  get: (path) => request(`${WP_API}${path}`),
  post: (path, body) => request(`${WP_API}${path}`, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(`${WP_API}${path}`, { method: "PUT", body: JSON.stringify(body) }),
  del: (path) => request(`${WP_API}${path}`, { method: "DELETE" }),
};

export async function login(username, password) {
  const data = await request(`${JWT_API}/token`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  setToken(data.token);
  return data;
}

export async function validateToken() {
  if (!getToken()) return false;
  try {
    await request(`${JWT_API}/token/validate`, { method: "POST" });
    return true;
  } catch {
    clearToken();
    return false;
  }
}

export async function fetchCurrentUser() {
  return request(`${WP_API}/users/me?context=edit`);
}
