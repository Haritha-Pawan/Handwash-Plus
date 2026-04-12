export function saveAuthToken(token) {
  if (typeof window === "undefined") return;
  const normalized = typeof token === "string" ? token.replace(/^"|"$/g, "").trim() : "";
  if (!normalized || normalized === "undefined" || normalized === "null") {
    localStorage.removeItem("token");
    return;
  }
  localStorage.setItem("token", normalized);
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  const normalized = token.replace(/^"|"$/g, "").trim();
  if (!normalized || normalized === "undefined" || normalized === "null") {
    return null;
  }
  return normalized;
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
}

export function saveAuthUser(user) {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(user);
  localStorage.setItem("authUser", serialized);
  localStorage.setItem("user", serialized);
}

export function getAuthUser() {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("authUser") || localStorage.getItem("user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuthUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authUser");
}