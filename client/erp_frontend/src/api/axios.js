import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Attach access token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh token automatically on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
          refresh,
        });
        localStorage.setItem("access", res.data.access);
        error.config.headers.Authorization = `Bearer ${res.data.access}`;
        return api(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
