import axios from "axios";


const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
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