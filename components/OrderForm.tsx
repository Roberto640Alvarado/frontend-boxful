"use client";

import { useState } from "react";
import { OrderDraft } from "@/app/(private)/home/page";

// Estilos base para inputs y selects
const inputStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1.5px solid #e5e7eb",
  borderRadius: "8px",
  padding: "10px 12px",
  fontSize: "13px",
  outline: "none",
  color: "#111",
  width: "100%",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  WebkitAppearance: "none",
  cursor: "pointer",
  paddingRight: "28px",
};

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function StyledInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }
) {
  const { hasError, style, ...rest } = props;
  return (
    <input
      {...rest}
      style={{
        ...inputStyle,
        ...style,
        borderColor: hasError ? "#f87171" : "#e5e7eb",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = hasError ? "#f87171" : "#3b5bdb";
        e.target.style.boxShadow = "0 0 0 3px rgba(59,91,219,0.1)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = hasError ? "#f87171" : "#e5e7eb";
        e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
      }}
    />
  );
}

const INITIAL: OrderDraft = {
  direccionRecoleccion: "",
  fechaProgramada: "",
  nombres: "",
  apellidos: "",
  correo: "",
  telefono: "",
  codigoPais: "503",
  direccionDestinatario: "",
  departamento: "",
  municipio: "",
  puntoReferencia: "",
  indicaciones: "",
};

type FormErrors = Partial<Record<keyof OrderDraft, string>>;

export default function OrderForm({
  onNext,
}: {
  onNext: (data: OrderDraft) => void;
}) {
  const [form, setForm] = useState<OrderDraft>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.direccionRecoleccion.trim()) e.direccionRecoleccion = "Requerido";
    if (!form.fechaProgramada) e.fechaProgramada = "Requerido";
    if (!form.nombres.trim()) e.nombres = "Requerido";
    if (!form.apellidos.trim()) e.apellidos = "Requerido";
    if (!form.correo.trim()) e.correo = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo))
      e.correo = "Correo inválido";
    if (!form.telefono.trim()) e.telefono = "Requerido";
    if (!form.direccionDestinatario.trim()) e.direccionDestinatario = "Requerido";
    if (!form.departamento.trim()) e.departamento = "Requerido";
    if (!form.municipio.trim()) e.municipio = "Requerido";
    if (!form.puntoReferencia.trim()) e.puntoReferencia = "Requerido";
    return e;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onNext(form);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 w-full">
      <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-6">
        Completa los datos
      </h3>

      <div className="flex flex-col gap-5">

        {/* Fila 1: Dirección  + Fecha  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2">
            <Field label="Dirección de recolección" error={errors.direccionRecoleccion}>
              <StyledInput
                name="direccionRecoleccion"
                type="text"
                placeholder="Colonia Las Magnolias, calle militar 1, San Salvador"
                value={form.direccionRecoleccion}
                onChange={handleChange}
                hasError={!!errors.direccionRecoleccion}
              />
            </Field>
          </div>
          <Field label="Fecha programada" error={errors.fechaProgramada}>
            <StyledInput
              name="fechaProgramada"
              type="date"
              value={form.fechaProgramada}
              onChange={handleChange}
              hasError={!!errors.fechaProgramada}
            />
          </Field>
        </div>

        {/* Fila 2: Nombres + Apellidos + Correo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <Field label="Nombres" error={errors.nombres}>
            <StyledInput
              name="nombres"
              type="text"
              placeholder="Gabriela Reneé"
              value={form.nombres}
              onChange={handleChange}
              hasError={!!errors.nombres}
            />
          </Field>
          <Field label="Apellidos" error={errors.apellidos}>
            <StyledInput
              name="apellidos"
              type="text"
              placeholder="Días López"
              value={form.apellidos}
              onChange={handleChange}
              hasError={!!errors.apellidos}
            />
          </Field>
          <Field label="Correo electrónico" error={errors.correo}>
            <StyledInput
              name="correo"
              type="email"
              placeholder="gabbydiaz@gmail.com"
              value={form.correo}
              onChange={handleChange}
              hasError={!!errors.correo}
            />
          </Field>
        </div>

        {/* Fila 3: Teléfono + Dirección destinatario  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Teléfono</label>
            <div className="flex gap-1.5">
              <div className="relative" style={{ width: "76px", flexShrink: 0 }}>
                <select
                  name="codigoPais"
                  value={form.codigoPais}
                  onChange={handleChange}
                  style={selectStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b5bdb";
                    e.target.style.boxShadow = "0 0 0 3px rgba(59,91,219,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
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
                <svg
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                  width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              <StyledInput
                name="telefono"
                type="tel"
                placeholder="7777 7777"
                value={form.telefono}
                onChange={handleChange}
                hasError={!!errors.telefono}
              />
            </div>
            {errors.telefono && (
              <p className="text-xs text-red-500 mt-0.5">{errors.telefono}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Field label="Dirección del destinatario" error={errors.direccionDestinatario}>
              <StyledInput
                name="direccionDestinatario"
                type="text"
                placeholder="Final 49 Av. Sur y Bulevar Los Próceres, Bodega #8"
                value={form.direccionDestinatario}
                onChange={handleChange}
                hasError={!!errors.direccionDestinatario}
              />
            </Field>
          </div>
        </div>

        {/* Fila 4: Departamento + Municipio + Punto de referencia */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <Field label="Departamento" error={errors.departamento}>
            <StyledInput
              name="departamento"
              type="text"
              placeholder="San Salvador"
              value={form.departamento}
              onChange={handleChange}
              hasError={!!errors.departamento}
            />
          </Field>
          <Field label="Municipio" error={errors.municipio}>
            <StyledInput
              name="municipio"
              type="text"
              placeholder="San Salvador"
              value={form.municipio}
              onChange={handleChange}
              hasError={!!errors.municipio}
            />
          </Field>
          <Field label="Punto de referencia" error={errors.puntoReferencia}>
            <StyledInput
              name="puntoReferencia"
              type="text"
              placeholder="Cerca de redondel Árbol de la Paz"
              value={form.puntoReferencia}
              onChange={handleChange}
              hasError={!!errors.puntoReferencia}
            />
          </Field>
        </div>

        {/* Fila 5: Indicaciones */}
        <Field label="Indicaciones">
          <StyledInput
            name="indicaciones"
            type="text"
            placeholder="Llamar antes de entregar"
            value={form.indicaciones}
            onChange={handleChange}
          />
        </Field>

        {/* Botón Siguiente */}
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "#3b5bdb" }}
          >
            Siguiente
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}