"use client";

import { useEffect } from "react";

interface Props {
  telefono: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmPhoneModal({ telefono, onConfirm, onCancel }: Props) {
  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
      onClick={onCancel}
    >
      <div
        className="relative bg-white rounded-2xl shadow-xl flex flex-col items-center"
        style={{ width: "360px", padding: "36px 32px 28px" }}
        onClick={e => e.stopPropagation()}
      >
        {/* X */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Icono */}
        <div
          className="flex items-center justify-center rounded-full mb-5"
          style={{ width: "64px", height: "64px", background: "#fff7ed" }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        {/* Texto */}
        <h3 className="text-lg text-gray-900 mb-2 text-center">
          Confirmar número de <strong>teléfono</strong>
        </h3>
        <p className="text-sm text-gray-500 text-center mb-7 leading-relaxed">
          ¿Está seguro de que desea continuar con el número{" "}
          <strong className="text-gray-800">{telefono}</strong>?
        </p>

        {/* Botones */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            style={{
              padding: "11px",
              background: "#f3f4f6",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "11px",
              background: "#2563eb",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = "#1d4ed8"; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = "#2563eb"; }}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}