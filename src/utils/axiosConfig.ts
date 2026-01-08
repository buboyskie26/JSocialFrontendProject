import axios from "axios";

const SERVER_LOCAL = "http://localhost:3000/api";
const SERVER_CLOUD = import.meta.env.VITE_API_URL;

// ✅ Fallback to local if env variable is not set (for development)
const BASE_URL = SERVER_CLOUD || SERVER_LOCAL;

const api = axios.create({
  baseURL: BASE_URL,
  // baseURL: SERVER_LOCAL,
  withCredentials: true, // ✅ allow cookies
  // timeout: 10000, // 10 second timeout
});

// Add interceptor to attach token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Handle 401 errors (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("401 error - Token expired or invalid");
      localStorage.removeItem("token");
      // Uncomment if you want automatic redirect:
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
