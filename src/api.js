/* ---------------------------------------------------------
   Centralized API helper with JWT auth
--------------------------------------------------------- */

const TOKEN_KEY = "skintrack_token";

// In production (Cloudflare Pages), set VITE_API_URL to your Render backend URL.
// e.g. https://skintracker-api.onrender.com
// In development, leave empty — Vite proxy handles /api → localhost:3001
const API_BASE = import.meta.env.VITE_API_URL || "";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(method, url, body, isFormData = false) {
  url = `${API_BASE}${url}`;
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  const opts = { method, headers };
  if (body) {
    opts.body = isFormData ? body : JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(url, opts);
  } catch {
    throw new Error("Unable to connect to the backend server. Make sure `npm run server` or `npm run dev:full` is running.");
  }

  let data;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: res.ok ? "Invalid server response" : `Server error (${res.status})` };
  }

  if (!res.ok) {
    const err = new Error(data.error || `Request failed with status ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return data;
}

const api = {
  get: (url) => request("GET", url),
  post: (url, body) => request("POST", url, body),
  delete: (url) => request("DELETE", url),
  upload: (url, formData) => request("POST", url, formData, true),
};

export default api;
