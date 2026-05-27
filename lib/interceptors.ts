import apiClient from "@/lib/apiClient";
import { storage } from "@/lib/storage";

let initialized = false;

export function setupInterceptors() {
  if (initialized) return;
  initialized = true;

  // ─── REQUEST ──────────────────────────────────────────────────────────────
  apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = storage.get("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // ─── RESPONSE ─────────────────────────────────────────────────────────────
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && typeof window !== "undefined") {
        storage.remove("access_token");
        storage.remove("nombre_usuario");
        window.location.href = "/login";
      }
      return Promise.reject(error.response?.data ?? error);
    }
  );
}