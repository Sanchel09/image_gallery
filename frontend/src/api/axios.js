import axios from "axios";
import { BASE_URL } from "../utils/Constants";

const instance = axios.create({
  baseURL: BASE_URL, // Adjust to match your backend
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh access token on 401
instance.interceptors.response.use(
  (response) => response, // pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(`${BASE_URL}auth/refresh-token`, {
          refreshToken,
        });

        const newToken = res.data.data.accessToken;
        localStorage.setItem("token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return instance(originalRequest); // retry original request
      } catch (err) {
        // Refresh failed — clear storage and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
