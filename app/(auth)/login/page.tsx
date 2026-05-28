"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { login } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refetch } = useAuth();
  const [form, setForm] = useState({ correo: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Manejo de cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  
  try {
    await login(form);
    await refetch();
    router.push("/home");
  } catch (err: unknown) {
    const msg = (err as { message?: string })?.message ?? "Error al iniciar sesión";
    setError(msg);
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="flex w-full" style={{ height: "100vh", overflow: "hidden" }}>

      {/* ── Panel izquierdo ── */}
      <div
        className="flex flex-col justify-center w-full md:w-1/2 animate-slide-in"
        style={{ height: "100vh", overflow: "hidden", background: "#fafafa" }}
      >
        <div style={{ width: "90%", margin: "0 auto" }}>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Bienvenido</h1>
          <p className="text-base text-gray-500 mb-7">Por favor ingresa tus credenciales</p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Correo */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="correo" className="text-xs font-semibold text-gray-700">
                Correo electrónico
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                autoComplete="email"
                placeholder="Digita tu correo"
                value={form.correo}
                onChange={handleChange}
                required
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  outline: "none",
                  color: "#111",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={e => {
                  e.target.style.borderColor = "#3b82f6";
                  e.target.style.boxShadow = "0 0 0 4px rgba(59,130,246,0.1)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                }}
              />
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Digita la contraseña"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  outline: "none",
                  color: "#111",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={e => {
                  e.target.style.borderColor = "#3b82f6";
                  e.target.style.boxShadow = "0 0 0 4px rgba(59,130,246,0.1)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                }}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="mt-1">
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: "#2563eb",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: 600,
                  borderRadius: "12px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  transition: "background 0.2s, transform 0.1s",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={e => { if (!loading) (e.target as HTMLButtonElement).style.background = "#1d4ed8"; }}
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = "#2563eb"; }}
                onMouseDown={e => { (e.target as HTMLButtonElement).style.transform = "scale(0.98)"; }}
                onMouseUp={e => { (e.target as HTMLButtonElement).style.transform = "scale(1)"; }}
              >
                {loading ? "Ingresando…" : "Iniciar sesión"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            ¿Necesitas una cuenta?{" "}
            <Link href="/register" className="font-bold hover:underline text-black">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>

      {/* ── Panel derecho ── */}
      <div
        className="hidden md:flex md:w-1/2 flex-col animate-fade-in"
        style={{
          height: "100vh",
          overflow: "hidden",
          background: "linear-gradient(160deg, #ffffff 0%, #f4f4f5 100%)",
        }}
      >
        <div className="flex-none px-12 pt-12 pb-4 text-center animate-slide-up">
          <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-3">
            Tu paquete,<br />
            donde <span className="text-orange-500">tú</span> decidas.
          </h2>
          <p className="text-base text-gray-400 leading-relaxed">
            Recoge y envía desde nuestros lockers en cualquier momento.
          </p>
        </div>

        <div className="flex-1 relative animate-locker-float px-10 pb-4">
          <Image
            src="/portada1.webp"
            alt="Locker Boxful"
            fill
            className="object-contain object-center drop-shadow-xl"
            priority
          />
        </div>
      </div>

      {/* ── Animaciones ── */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lockerFloat {
          0%, 100% { transform: translateY(0px) rotate(-0.4deg); }
          50%       { transform: translateY(-16px) rotate(0.4deg); }
        }
        .animate-slide-in     { animation: slideIn 0.5s cubic-bezier(.22,1,.36,1) both; }
        .animate-fade-in      { animation: fadeIn 0.6s ease both; }
        .animate-slide-up     { animation: slideUp 0.7s 0.2s cubic-bezier(.22,1,.36,1) both; }
        .animate-locker-float { animation: lockerFloat 5s ease-in-out infinite; }
      `}</style>
    </main>
  );
}