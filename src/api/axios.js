import axios from "axios";

// Base instance — replace baseURL with your real API later
const axiosInstance = axios.create({
  baseURL: "https://api.fda.gov", // mock API for now
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST interceptor — attach auth token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("medicare_user");
    if (user) {
      const parsed = JSON.parse(user);
      // Attach token if your backend sends one
      config.headers["Authorization"] = `Bearer mock-token-${parsed.id}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE interceptor — handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("medicare_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;