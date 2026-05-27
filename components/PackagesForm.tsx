"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/services/orderService";
import { OrderDraft } from "@/app/(private)/home/page";

const inputStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1.5px solid #e5e7eb",
  borderRadius: "8px",
  padding: "9px 10px",
  fontSize: "13px",
  outline: "none",
  color: "#111",
  width: "100%",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

// Definición del tipo de paquete y estado inicial vacío
type Paquete = {
  largo: number;
  alto: number;
  ancho: number;
  peso: number;
  contenido: string;
};

const EMPTY_PAQUETE: Paquete = {
  largo: 0,
  alto: 0,
  ancho: 0,
  peso: 0,
  contenido: "",
};

// Componentes auxiliares para inputs estilizados y el ícono de caja
function SmallInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...(props.style ?? {}) }}
      onFocus={(e) => {
        e.target.style.borderColor = "#3b5bdb";
        e.target.style.boxShadow = "0 0 0 3px rgba(59,91,219,0.1)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#e5e7eb";
        e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
      }}
    />
  );
}

function BoxIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 27 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.4728 23.5312L5.74728 19.5C5.46196 19.3333 5.24287 19.1042 5.09001 18.8125C4.93716 18.5208 4.86073 18.2083 4.86073 17.875V9.84375C4.86073 9.51042 4.93716 9.19792 5.09001 8.90625C5.24287 8.61458 5.46196 8.38542 5.74728 8.21875L12.5034 4.125C12.7887 3.95833 13.1046 3.875 13.4511 3.875C13.7976 3.875 14.1135 3.95833 14.3988 4.125L21.1549 8.21875C21.4402 8.38542 21.6593 8.61458 21.8122 8.90625C21.965 9.19792 22.0414 9.51042 22.0414 9.84375V17.875C22.0414 18.2083 21.9599 18.5208 21.7969 18.8125C21.6338 19.1042 21.4096 19.3333 21.1243 19.5L14.3071 23.5312C14.0217 23.6979 13.716 23.7812 13.3899 23.7812C13.0639 23.7812 12.7582 23.6979 12.4728 23.5312ZM0 5.90625V3.5C0 2.54167 0.336277 1.71875 1.00883 1.03125C1.68139 0.34375 2.48641 0 3.42391 0H5.77785V1.875H3.42391C2.97554 1.875 2.59851 2.03125 2.2928 2.34375C1.98709 2.65625 1.83424 3.04167 1.83424 3.5V5.90625H0ZM3.42391 27.5C2.48641 27.5 1.68139 27.1562 1.00883 26.4688C0.336277 25.7812 0 24.9583 0 24V21.5938H1.83424V24C1.83424 24.4583 1.98709 24.8438 2.2928 25.1562C2.59851 25.4688 2.97554 25.625 3.42391 25.625H5.77785V27.5H3.42391ZM21.1243 27.375V25.5H23.4783C23.9266 25.5 24.3037 25.3438 24.6094 25.0312C24.9151 24.7188 25.0679 24.3333 25.0679 23.875V21.4688H26.9022V23.875C26.9022 24.8333 26.5659 25.6562 25.8933 26.3438C25.2208 27.0313 24.4158 27.375 23.4783 27.375H21.1243ZM25.0679 5.90625V3.5C25.0679 3.04167 24.9151 2.65625 24.6094 2.34375C24.3037 2.03125 23.9266 1.875 23.4783 1.875H21.1243V0H23.4783C24.4158 0 25.2208 0.34375 25.8933 1.03125C26.5659 1.71875 26.9022 2.54167 26.9022 3.5V5.90625H25.0679ZM7.64266 9.25L6.72554 9.8125V10.9688L12.534 14.375V21.375L13.4511 21.9375L14.3682 21.375V14.375L20.2072 10.9688V9.8125L19.2595 9.25L13.4511 12.6875L7.64266 9.25Z"
        fill="#ACB3C5"
      />
    </svg>
  );
}

function DimInput({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">{label}</label>
      <div
        className="flex items-center"
        style={{
          background: "#ffffff",
          border: "1.5px solid #e5e7eb",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <input
          name={name}
          type="number"
          min="0"
          placeholder="15"
          value={value || ""}
          onChange={onChange}
          style={{
            width: "44px",
            padding: "9px 6px 9px 10px",
            fontSize: "13px",
            outline: "none",
            border: "none",
            background: "transparent",
            color: "#111",
          }}
          onFocus={(e) => {
            const parent = e.target.parentElement;
            if (parent) {
              parent.style.borderColor = "#3b5bdb";
              parent.style.boxShadow = "0 0 0 3px rgba(59,91,219,0.1)";
            }
          }}
          onBlur={(e) => {
            const parent = e.target.parentElement;
            if (parent) {
              parent.style.borderColor = "#e5e7eb";
              parent.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
            }
          }}
        />
        <span className="text-xs text-gray-400 px-2 flex-shrink-0">cm</span>
      </div>
    </div>
  );
}

export default function PackagesForm({
  orderDraft,
  onBack,
}: {
  orderDraft: OrderDraft;
  onBack: () => void;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Paquete>({ ...EMPTY_PAQUETE });
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDraftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setDraft((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    setError(null);
  };

  const handleAdd = () => {
    if (
      !draft.contenido.trim() ||
      !draft.peso ||
      !draft.largo ||
      !draft.alto ||
      !draft.ancho
    ) {
      setError("Completa todos los campos del paquete antes de agregar");
      return;
    }
    setPaquetes((prev) => [...prev, { ...draft }]);
    setDraft({ ...EMPTY_PAQUETE });
    setError(null);
  };

  const handleRemove = (index: number) => {
    setPaquetes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (paquetes.length === 0) {
      setError("Agrega al menos un paquete");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createOrder({
        ...orderDraft,
        telefono: `+${orderDraft.codigoPais}${orderDraft.telefono.replace(/\s/g, "")}`,
        paquetes,
      });
      router.push("/history");
    } catch (err: unknown) {
      const raw = (err as { message?: string | string[] })?.message;
      setError(
        Array.isArray(raw) ? raw[0] : (raw ?? "Error al crear la orden"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 w-full">
      <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-6">
        Agrega tus productos
      </h3>

      {/* Contenedor input*/}
      <div
        className="rounded-xl p-4 mb-4"
        style={{ background: "#f9fafb", border: "1.5px solid #e5e7eb" }}
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg  flex-shrink-0 self-end mb-0.5">
            <BoxIcon size={22} />
          </div>

          <DimInput
            label="Largo"
            name="largo"
            value={draft.largo}
            onChange={handleDraftChange}
          />
          <DimInput
            label="Alto"
            name="alto"
            value={draft.alto}
            onChange={handleDraftChange}
          />
          <DimInput
            label="Ancho"
            name="ancho"
            value={draft.ancho}
            onChange={handleDraftChange}
          />

          <div className="flex flex-col gap-1" style={{ minWidth: "110px" }}>
            <label className="text-xs text-gray-500">Peso en libras</label>
            <SmallInput
              name="peso"
              type="number"
              min="0"
              step="0.1"
              placeholder="3 libras"
              value={draft.peso || ""}
              onChange={handleDraftChange}
            />
          </div>

          <div
            className="flex flex-col gap-1 flex-1"
            style={{ minWidth: "150px" }}
          >
            <label className="text-xs text-gray-500">Contenido</label>
            <SmallInput
              name="contenido"
              type="text"
              placeholder="iPhone 14 pro Max"
              value={draft.contenido}
              onChange={handleDraftChange}
            />
          </div>
        </div>

        {/* Botón Agregar */}
        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-all"
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              background: "#fff",
              border: "1.5px solid #e5e7eb",
            }}
          >
            Agregar
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cards de paquetes  */}
      {paquetes.length > 0 && (
        <div className="flex flex-col gap-3 mb-4">
          {paquetes.map((pkg, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center gap-3 rounded-xl px-4 py-3"
              style={{ border: "1.5px solid #86efac", minHeight: "72px" }}
            >
              {/* Peso */}
              <div
                className="flex flex-col gap-1"
                style={{ minWidth: "110px" }}
              >
                <span className="text-xs text-gray-400">Peso en libras</span>
                <div
                  style={{
                    background: "#fff",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "6px 10px",
                  }}
                >
                  <span className="text-sm text-gray-800">
                    {pkg.peso} libras
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div
                className="flex flex-col gap-1 flex-1"
                style={{ minWidth: "130px" }}
              >
                <span className="text-xs text-gray-400">Contenido</span>
                <div
                  style={{
                    background: "#fff",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "6px 10px",
                  }}
                >
                  <span className="text-sm text-gray-800">{pkg.contenido}</span>
                </div>
              </div>

              {/* Icono */}
              <div className="hidden sm:flex items-center justify-center flex-shrink-0 mt-5">
                <BoxIcon size={22} />
              </div>

              {/* Dimensiones */}
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                {/* Labels */}
                <div className="grid grid-cols-3" style={{ gap: "0" }}>
                  {["Largo", "Alto", "Ancho"].map((label) => (
                    <span
                      key={label}
                      className="text-xs font-semibold text-gray-700 px-4"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <div
                  className="grid grid-cols-3"
                  style={{
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#fff",
                  }}
                >
                  {[pkg.largo, pkg.alto, pkg.ancho].map((val, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-4 py-2.5"
                      style={{
                        borderRight: idx < 2 ? "1.5px solid #e5e7eb" : "none",
                      }}
                    >
                      <span className="text-sm text-gray-800">{val}</span>
                      <span className="text-sm text-gray-400">cm</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón eliminar*/}
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="flex-shrink-0 flex items-center justify-center transition-colors hover:bg-red-50 mt-5"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  border: "1.5px solid #fca5a5",
                  background: "#fff",
                  color: "#f87171",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {/* Botones Regresar / Enviar */}
      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-800 transition-all"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Regresar
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
          style={{ background: "#3b5bdb" }}
        >
          {loading ? "Enviando…" : "Enviar"}
          {!loading && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
