import apiClient from "@/lib/apiClient";
import {
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  WhoAmIResponse,
} from "@/types/auth.types";

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>("/auth/register", payload);
  return data;
}

export async function login(payload: LoginPayload): Promise<void> {
  await apiClient.post("/auth/login", payload);
}

export async function whoami(): Promise<WhoAmIResponse> {
  const { data } = await apiClient.get<WhoAmIResponse>("/auth/whoami");
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}