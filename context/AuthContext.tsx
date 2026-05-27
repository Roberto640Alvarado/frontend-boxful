"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { whoami, logout as logoutService } from "@/services/authService";
import { WhoAmIResponse } from "@/types/auth.types";
import { storage } from "@/lib/storage";

interface AuthContextValue {
  user: WhoAmIResponse | null;
  loading: boolean;
  refetch: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<WhoAmIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Al montar el componente, intenta obtener la información del usuario autenticado
  useEffect(() => {
    const token = storage.get("access_token");
    const request = token ? whoami().catch(() => null) : Promise.resolve(null);

    request.then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  // Función para refetch de la información del usuario (útil después de login)
  const refetch = useCallback(async () => {
    const token = storage.get("access_token");
    const data = token ? await whoami().catch(() => null) : null;
    setUser(data);
    setLoading(false);
  }, []);

  // Función de logout limpia el token, el estado del usuario y redirige a login
  const logout = useCallback(() => {
    logoutService();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, refetch, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
