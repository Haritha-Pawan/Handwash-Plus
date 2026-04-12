import axios from "axios";


const normalizeApiBaseUrl = (rawUrl) => {
  const fallback = "http://localhost:5000/api";
  const candidate = (rawUrl || fallback).trim();

  if (!candidate) return fallback;
  if (candidate.endsWith("/api")) return candidate;
  if (candidate.endsWith("/api/")) return candidate.slice(0, -1);
  return `${candidate.replace(/\/+$/, "")}/api`;
};

const apiBaseUrl = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);


const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://handwash-plus-ea8v.vercel.app/",
  withCredentials: true,
  baseURL: apiBaseUrl,
  // Auth is sent via Bearer token; cookies are not required.
  withCredentials: false,
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    console.log("TOKEN BEING USED:", token); // 🔥 debug

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  return config;
});
// ✅ Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - token expired or missing");
      // optional: redirect
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;