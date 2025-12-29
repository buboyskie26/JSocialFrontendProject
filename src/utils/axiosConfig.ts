import axios from "axios";
//
const SERVER_LOCAL = "http://localhost:3000/api";
// Updated code should be pushed in repository
const SERVER_CLOUD =
  "https://jsocialbackendproject-deployment.onrender.com/api";

const api = axios.create({
  // baseURL: `${SERVER_LOCAL}`, // CLOUD SERVER backend URL
  baseURL: `${SERVER_CLOUD}`, // LOCAL SERVER backend URL
  withCredentials: true, // ✅ allow cookies
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
      // console.log("401 error");
      // Token expired or invalid
      localStorage.removeItem("token");
      // window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);
export default api;
