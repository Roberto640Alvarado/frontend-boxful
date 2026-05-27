import apiClient from "@/lib/apiClient";
import { storage } from "@/lib/storage";
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  WhoAmIResponse,
} from "@/types/auth.types";

// Guarda token en localStorage Y en cookie
function saveToken(token: string) {
  storage.set("access_token", token);
  document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
}

// Elimina token de localStorage y cookie
function clearToken() {
  storage.remove("access_token");
  document.cookie = "access_token=; path=/; max-age=0";
}

// Registro de nuevo usuario
export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>("/auth/register", payload);
  return data;
}

// Login y guarda el token de acceso
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  saveToken(data.access_token);
  return data;
}

// Obtiene información del usuario autenticado
export async function whoami(): Promise<WhoAmIResponse> {
  const { data } = await apiClient.get<WhoAmIResponse>("/auth/whoami");
  return data;
}

// Logout del usuario
export function logout(): void {
  clearToken();
}

// Verifica si el usuario está autenticado
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!storage.get("access_token");
}