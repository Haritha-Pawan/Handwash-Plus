import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://handwash-plus-ea8v.vercel.app/",
    withCredentials: false,
    timeout: 10000,
    headers: {
        'Content-Type': "application/json",
    },
});

axiosClient.interceptors.request.use((config) => {
    // Only access localStorage if in browser environment
    if (typeof window !== "undefined") {
        const token = localStorage.getItem('token'); // Adjust key if needed (e.g., 'accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosClient;
