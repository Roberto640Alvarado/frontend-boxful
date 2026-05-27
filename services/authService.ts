import apiClient from "@/lib/apiClient";
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  WhoAmIResponse,
} from "@/types/auth.types";

// Registrar un nuevo usuario
export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>("/auth/register", payload);
  return data;
}

// Iniciar sesión y almacenar el token en localStorage
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);

  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("nombre_usuario", data.nombre);
  }

  return data;
}

// Obtener información del usuario autenticado
export async function whoami(): Promise<WhoAmIResponse> {
  const { data } = await apiClient.get<WhoAmIResponse>("/auth/whoami");
  return data;
}

// Cerrar sesión eliminando el token del localStorage
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("nombre_usuario");
  }
}

// Verificar si el usuario está autenticado
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("access_token");
}