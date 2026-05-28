"use client";

import { useEffect } from "react";

interface Props {
  onGoHistory: () => void;
  onCreateAnother: () => void;
}

export default function OrderSuccessModal({ onGoHistory, onCreateAnother }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onGoHistory();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onGoHistory]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
    >
      <div
        className="relative bg-white rounded-2xl shadow-xl flex flex-col items-center"
        style={{ width: "360px", padding: "40px 32px 32px" }}
      >
        {/* X */}
        <button
          onClick={onGoHistory}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Icono */}
        <div className="mb-6">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="45" cy="45" r="45" fill="#EFFDF4"/>
            <path d="M38.8812 63.8992L35.4612 58.1392L28.9812 56.6992L29.6112 50.0392L25.2012 44.9992L29.6112 39.9592L28.9812 33.2992L35.4612 31.8592L38.8812 26.0992L45.0012 28.7092L51.1212 26.0992L54.5412 31.8592L61.0212 33.2992L60.3912 39.9592L64.8012 44.9992L60.3912 50.0392L61.0212 56.6992L54.5412 58.1392L51.1212 63.8992L45.0012 61.2892L38.8812 63.8992ZM43.1112 51.3892L53.2812 41.2192L50.7612 38.6092L43.1112 46.2592L39.2412 42.4792L36.7212 44.9992L43.1112 51.3892Z" fill="#1A5656"/>
          </svg>
        </div>

        {/* Texto */}
        <h3 className="text-lg text-gray-900 mb-2 text-center">
          Orden <strong>enviada</strong>
        </h3>
        <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
          La orden ha sido creada y enviada exitosamente
        </p>

        {/* Botones */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onGoHistory}
            className="flex-1 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            style={{
              padding: "12px",
              background: "#f3f4f6",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Ver historial
          </button>
          <button
            onClick={onCreateAnother}
            style={{
              flex: 1,
              padding: "12px",
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
            Crear otra
          </button>
        </div>
      </div>
    </div>
  );
}