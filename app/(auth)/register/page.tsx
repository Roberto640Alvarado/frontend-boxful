"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { register, login } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { RegisterPayload } from "@/types/auth.types";
import ConfirmPhoneModal from "@/components/ConfirmPhoneModal";
import Toast from "@/components/Toast";

const EMPTY: RegisterPayload = {
  nombre: "",
  apellido: "",
  sexo: "M",
  fechaNacimiento: "",
  correo: "",
  telefono: "",
  password: "",
};

const inputStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1.5px solid #e5e7eb",
  borderRadius: "12px",
  padding: "11px 14px",
  fontSize: "13px",
  outline: "none",
  color: "#111",
  width: "100%",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  const { hasError, ...rest } = props;
  return (
    <input
      {...rest}
      style={{
        ...inputStyle,
        ...(rest.style ?? {}),
        borderColor: hasError ? "#f87171" : "#e5e7eb",
      }}
      onFocus={e => {
        e.target.style.borderColor = hasError ? "#f87171" : "#3b82f6";
        e.target.style.boxShadow = hasError
          ? "0 0 0 4px rgba(248,113,113,0.15)"
          : "0 0 0 4px rgba(59,130,246,0.1)";
      }}
      onBlur={e => {
        e.target.style.borderColor = hasError ? "#f87171" : "#e5e7eb";
        e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
      }}
    />
  );
}

type FormErrors = Partial<Record<keyof RegisterPayload | "confirmPassword", string>>;
type ToastState = { type: "success" | "error"; title: string; message?: string } | null;

function EyeOpen() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { refetch } = useAuth();

  const [form, setForm] = useState<RegisterPayload>(EMPTY);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [codigoPais, setCodigoPais] = useState("503");
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setApiError(null);
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es requerido";
    if (!form.apellido.trim()) e.apellido = "El apellido es requerido";
    if (!form.sexo) e.sexo = "Selecciona un sexo";
    if (!form.fechaNacimiento) e.fechaNacimiento = "La fecha es requerida";
    if (!form.correo.trim()) {
      e.correo = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      e.correo = "Correo inválido";
    }
    if (!form.telefono.trim()) {
      e.telefono = "El teléfono es requerido";
    } else if (!/^\d{7,15}$/.test(form.telefono.replace(/\s/g, ""))) {
      e.telefono = "Teléfono inválido";
    }
    if (!form.password) {
      e.password = "La contraseña es requerida";
    } else if (form.password.length < 8) {
      e.password = "Mínimo 8 caracteres";
    }
    if (!confirmPassword) {
      e.confirmPassword = "Confirma tu contraseña";
    } else if (form.password !== confirmPassword) {
      e.confirmPassword = "Las contraseñas no coinciden";
    }
    return e;
  };

  const handleNextClick = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setShowModal(false);
    setLoading(true);
    setApiError(null);
    try {
      const payload = {
        ...form,
        telefono: `+${codigoPais}${form.telefono.replace(/\s/g, "")}`,
      };
      await register(payload);
      await login({ correo: form.correo, password: form.password });
      await refetch();
      setToast({
        type: "success",
        title: "¡Cuenta creada exitosamente!",
        message: "Serás redirigido al inicio",
      });
      setTimeout(() => router.push("/login"), 3500);
    } catch (err: unknown) {
      const raw = (err as { message?: string | string[] })?.message;
      const msg = Array.isArray(raw) ? raw[0] : (raw ?? "Error al registrarse");
      setApiError(msg);
      setToast({
        type: "error",
        title: "Error al crear cuenta",
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none",
    WebkitAppearance: "none",
    cursor: "pointer",
  };

  return (
    <>
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {showModal && (
        <ConfirmPhoneModal
          telefono={`+${codigoPais} ${form.telefono}`}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}

      <main className="flex w-full" style={{ height: "100vh", overflow: "hidden" }}>

        {/* ── Panel izquierdo ── */}
        <div
          className="flex flex-col justify-center w-full md:w-1/2 animate-slide-in"
          style={{ height: "100vh", overflowY: "auto", background: "#fafafa" }}
        >
          <div style={{ width: "90%", margin: "0 auto", paddingTop: "2rem", paddingBottom: "2rem" }}>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">Cuéntanos de ti</h1>
            <p className="text-sm text-gray-500 mb-7">Completa la información de registro</p>

            <form onSubmit={handleNextClick} noValidate className="flex flex-col gap-5">

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre" error={errors.nombre}>
                  <StyledInput id="nombre" name="nombre" type="text"
                    placeholder="Digita tu nombre" value={form.nombre}
                    onChange={handleChange} hasError={!!errors.nombre} />
                </Field>
                <Field label="Apellido" error={errors.apellido}>
                  <StyledInput id="apellido" name="apellido" type="text"
                    placeholder="Digita tu apellido" value={form.apellido}
                    onChange={handleChange} hasError={!!errors.apellido} />
                </Field>
              </div>

              {/* Sexo y Fecha */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Sexo" error={errors.sexo}>
                  <div className="relative">
                    <select id="sexo" name="sexo" value={form.sexo}
                      onChange={handleChange}
                      style={{ ...selectStyle, borderColor: errors.sexo ? "#f87171" : "#e5e7eb" }}
                      onFocus={e => {
                        e.target.style.borderColor = errors.sexo ? "#f87171" : "#3b82f6";
                        e.target.style.boxShadow = "0 0 0 4px rgba(59,130,246,0.1)";
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = errors.sexo ? "#f87171" : "#e5e7eb";
                        e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                      }}
                    >
                      <option value="" disabled>Seleccionar</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </Field>
                <Field label="Fecha de nacimiento" error={errors.fechaNacimiento}>
                  <StyledInput id="fechaNacimiento" name="fechaNacimiento" type="date"
                    value={form.fechaNacimiento} onChange={handleChange}
                    hasError={!!errors.fechaNacimiento} />
                </Field>
              </div>

              {/* Correo y Teléfono */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Correo electrónico" error={errors.correo}>
                  <StyledInput id="correo" name="correo" type="email"
                    autoComplete="email" placeholder="Digitar correo"
                    value={form.correo} onChange={handleChange}
                    hasError={!!errors.correo} />
                </Field>
                <Field label="Número de WhatsApp" error={errors.telefono}>
                  <div className="flex gap-2">
                    <div className="relative" style={{ width: "90px", flexShrink: 0 }}>
                      <select value={codigoPais} onChange={e => setCodigoPais(e.target.value)}
                        style={{ ...selectStyle, paddingRight: "24px" }}
                        onFocus={e => {
                          e.target.style.borderColor = "#3b82f6";
                          e.target.style.boxShadow = "0 0 0 4px rgba(59,130,246,0.1)";
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = "#e5e7eb";
                          e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                        }}
                      >
                        <option value="503">503</option>
                        <option value="502">502</option>
                        <option value="504">504</option>
                        <option value="505">505</option>
                        <option value="506">506</option>
                        <option value="52">52</option>
                        <option value="1">1</option>
                      </select>
                      <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                        width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                    <StyledInput id="telefono" name="telefono" type="tel"
                      placeholder="7777 7777" value={form.telefono}
                      onChange={handleChange} hasError={!!errors.telefono} />
                  </div>
                </Field>
              </div>

              {/* Contraseñas */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Contraseña" error={errors.password}>
                  <div className="relative">
                    <StyledInput id="password" name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password" placeholder="Mín. 8 caracteres"
                      value={form.password} onChange={handleChange} minLength={8}
                      hasError={!!errors.password}
                      style={{ ...inputStyle, paddingRight: "42px", borderColor: errors.password ? "#f87171" : "#e5e7eb" }}
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                      {showPassword ? <EyeOff /> : <EyeOpen />}
                    </button>
                  </div>
                </Field>
                <Field label="Repetir contraseña" error={errors.confirmPassword}>
                  <div className="relative">
                    <StyledInput id="confirmPassword" name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password" placeholder="Repetir contraseña"
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: undefined })); }}
                      hasError={!!errors.confirmPassword}
                      style={{ ...inputStyle, paddingRight: "42px", borderColor: errors.confirmPassword ? "#f87171" : "#e5e7eb" }}
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                      {showConfirm ? <EyeOff /> : <EyeOpen />}
                    </button>
                  </div>
                </Field>
              </div>

              {apiError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {apiError}
                </p>
              )}

              <div className="mt-1">
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", padding: "13px",
                    background: "#2563eb", color: "white",
                    fontSize: "15px", fontWeight: 600,
                    borderRadius: "12px", border: "none",
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
                  {loading ? "Creando cuenta…" : "Siguiente"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-sm text-center text-gray-500">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="font-bold hover:underline text-black">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        {/* ── Panel derecho ── */}
        <div
          className="hidden md:flex md:w-1/2 flex-col animate-fade-in"
          style={{ height: "100vh", overflow: "hidden", background: "linear-gradient(160deg, #ffffff 0%, #f4f4f5 100%)" }}
        >
          <div className="flex-none px-12 pt-12 pb-4 text-center animate-slide-up">
            <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-3">
              Más opciones,<br />
              mejor <span className="text-orange-500">precio.</span>
            </h2>
            <p className="text-base text-gray-400 leading-relaxed">
              Accede al catálogo completo de empresas de envío y encuentra siempre la tarifa que más te conviene.
            </p>
          </div>
          <div className="flex-1 relative animate-locker-float px-10 pb-4">
            <Image src="/portada2.webp" alt="Locker Boxful" fill
              className="object-contain object-center drop-shadow-xl" priority />
          </div>
        </div>

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
    </>
  );
}