import apiClient from "@/lib/apiClient";

export function setupInterceptors() {
  // ─── REQUEST ────────────────────────────────────────────────────────────────
  apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // ─── RESPONSE ───────────────────────────────────────────────────────────────
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("nombre_usuario");
        window.location.href = "/login";
      }
      return Promise.reject(error.response?.data ?? error);
    }
  );
}