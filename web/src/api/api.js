import axios from "axios";

// --- THIS IS THE CRITICAL FIX ---
// In production (e.g., Netlify), process.env.REACT_APP_API_URL will be your live URL.
// In local development, it will be undefined, so we fall back to the localhost URL.
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;