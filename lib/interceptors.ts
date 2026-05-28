import apiClient from "@/lib/apiClient";

let initialized = false;

export function setupInterceptors() {
  if (initialized) return;
  initialized = true;

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && typeof window !== "undefined") {
        const isAuthRoute =
          window.location.pathname === "/login" ||
          window.location.pathname === "/register";

        if (!isAuthRoute) {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error.response?.data ?? error);
    }
  );
}