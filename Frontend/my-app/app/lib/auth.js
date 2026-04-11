export function saveAuthToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
}

export function saveAuthUser(user) {
  if (typeof window === "undefined") return;
  localStorage.setItem("authUser", JSON.stringify(user));
}

export function getAuthUser() {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("authUser");
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