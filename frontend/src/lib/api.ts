import axios from "axios";

const api = axios.create({
  baseURL: "https://orbit-hy1d.onrender.com",
  withCredentials: true,
});

let isRefreshing = false;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const isAuthEndpoint = error.config.url.includes("/auth/");

    if (error.response?.status === 401 && !isAuthEndpoint && !isRefreshing) {
      isRefreshing = true;
      try {
        await api.post("/auth/refresh");
        isRefreshing = false;
        return api(error.config);
      } catch {
        isRefreshing = false;
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
