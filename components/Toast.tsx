"use client";

import { useEffect, useState } from "react";

type ToastType = "success" | "error";

interface Props {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  type,
  title,
  message,
  duration = 3500,
  onClose,
}: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === "success";

  const colors = isSuccess
    ? {
        border: "#bbf7d0",
        iconBg: "#f0fdf4",
        iconStroke: "#22c55e",
        bar: "#22c55e",
      }
    : {
        border: "#fecaca",
        iconBg: "#fef2f2",
        iconStroke: "#ef4444",
        bar: "#ef4444",
      };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-white rounded-2xl shadow-xl px-5 py-4"
      style={{
        border: `1.5px solid ${colors.border}`,
        minWidth: "300px",
        maxWidth: "400px",
        transition: "opacity 0.3s, transform 0.3s",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      {/* Icono */}
      <div
        className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{ width: "42px", height: "42px", background: colors.iconBg }}
      >
        {isSuccess ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke={colors.iconStroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke={colors.iconStroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
      </div>

      {/* Texto */}
      <div className="flex flex-col gap-0.5 flex-1">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        {message && (
          <p className="text-xs text-gray-400 leading-relaxed">{message}</p>
        )}
      </div>

      {/* Barra de progreso */}
      <div
        className="absolute bottom-0 left-0 rounded-b-2xl"
        style={{
          height: "3px",
          background: colors.bar,
          width: "100%",
          transformOrigin: "left",
          animation: `shrink ${duration}ms linear forwards`,
        }}
      />

      <style>{`
        @keyframes shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}