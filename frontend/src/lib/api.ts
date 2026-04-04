import axios from "axios";

let accessToken: string | null = null;

export const setAccessToken = (t: string | null) => (accessToken = t);

const api = axios.create({
  baseURL: "https://orbit-hy1d.onrender.com",
  withCredentials: true,
});

let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

const processQueue = (newToken: string) => {
  queue.forEach((resolve) => resolve(newToken));
  queue = [];
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest.url?.includes("/auth/");

    if (error.response?.status !== 401 || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        queue.push((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await api.post("/auth/refresh");
      const newToken = res.data.accessToken;

      setAccessToken(newToken);
      processQueue(newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch {
      queue = [];
      setAccessToken(null);
      window.location.href = "/login";
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;