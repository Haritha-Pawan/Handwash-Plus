import axios from "axios";
import { clearAuthToken, clearAuthUser } from "../lib/auth";


const API = axios.create({
  baseURL: apiBaseUrl,
  // Auth is sent via Bearer token; cookies are not required.
  withCredentials: false,
});

const getStoredToken = () => {
  if (typeof window === "undefined") return null;

  const rawToken = localStorage.getItem("token") || localStorage.getItem("accessToken");
  if (!rawToken) return null;

  const normalized = rawToken.replace(/^"|"$/g, "").trim();
  if (!normalized || normalized === "undefined" || normalized === "null") {
    return null;
  }

  return normalized;
};

API.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});
// ✅ Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - token expired or missing");
      if (typeof window !== "undefined") {
        clearAuthToken();
        clearAuthUser();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;