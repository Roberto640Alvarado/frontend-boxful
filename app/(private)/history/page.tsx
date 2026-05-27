"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getOrderHistory } from "@/services/orderService";
import { OrderHistoryResponse, OrderSummary } from "@/types/order.types";

export default function HistorialPage() {
  const { user } = useAuth();
  const [data, setData] = useState<OrderHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOrderHistory({
      ...(fechaInicio && { fechaInicio }),
      ...(fechaFin && { fechaFin }),
    })
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg = (err as { message?: string })?.message ?? "Error al cargar historial";
          setError(msg);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [fechaInicio, fechaFin]);

  const handleBuscar = () => {
    setLoading(true);
    setError(null);
  };

  const handleClear = () => {
    setFechaInicio("");
    setFechaFin("");
  };

  const toggleRow = (id: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data?.ordenes.map((o) => o.numeroOrden) ?? []));
    }
    setSelectAll((v) => !v);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-10 py-4 flex items-center justify-between">
        <h1 className="text-base md:text-lg font-semibold text-gray-800">
          Mis <strong>envíos</strong>
        </h1>
        {user && (
          <span className="text-sm font-medium text-gray-600">
            {user.nombre} {user.apellido}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-6 md:px-10 py-6 md:py-8">

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3 mb-6">

          {/* Rango de fecha */}
          <div
            className="flex items-center gap-2"
            style={{
              background: "#fff",
              border: "1.5px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px 12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "13px",
                color: fechaInicio ? "#111" : "#9ca3af",
                background: "transparent",
                width: "130px",
              }}
            />
            <span className="text-gray-300">—</span>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "13px",
                color: fechaFin ? "#111" : "#9ca3af",
                background: "transparent",
                width: "130px",
              }}
            />
          </div>

          {/* Botón Buscar */}
          <button
            onClick={handleBuscar}
            className="text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              padding: "9px 20px",
              borderRadius: "8px",
              background: "#3b5bdb",
              border: "none",
              cursor: "pointer",
            }}
          >
            Buscar
          </button>

          {/* Botón Descargar */}
          <button
            className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-all"
            style={{
              padding: "9px 16px",
              borderRadius: "8px",
              background: "#fff",
              border: "1.5px solid #e5e7eb",
              cursor: "pointer",
            }}
          >
            Descargar órdenes
          </button>

          {/* Limpiar filtros */}
          {(fechaInicio || fechaFin) && (
            <button
              onClick={handleClear}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25" />
              <path d="M21 12a9 9 0 00-9-9" />
            </svg>
            <p className="text-sm">Cargando órdenes…</p>
          </div>

        ) : data?.ordenes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2 text-gray-400">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <p className="text-sm">No hay órdenes en este período</p>
          </div>

        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1.5px solid #f3f4f6" }}>
                  <th className="px-4 py-3 text-left" style={{ width: "40px" }}>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleAll}
                      style={{ cursor: "pointer", accentColor: "#3b5bdb" }}
                    />
                  </th>
                  {["No. de orden", "Nombre", "Apellidos", "Departamento", "Municipio", "Paquetes en orden"].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.ordenes.map((order: OrderSummary) => {
                  const isSelected = selectedRows.has(order.numeroOrden);
                  return (
                    <tr
                      key={order.numeroOrden}
                      style={{
                        borderBottom: "1px solid #f9fafb",
                        background: isSelected ? "#f5f7ff" : "#fff",
                        transition: "background 0.15s",
                      }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(order.numeroOrden)}
                          style={{ cursor: "pointer", accentColor: "#3b5bdb" }}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                        {order.numeroOrden}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.nombres}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.apellidos}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.departamento}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.municipio}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-500 text-center">
                        {order.cantidadPaquetes}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

    
  );
}
