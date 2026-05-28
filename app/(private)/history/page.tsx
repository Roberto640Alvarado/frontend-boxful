"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getOrderHistory } from "@/services/orderService";
import { OrderHistoryResponse, OrderSummary } from "@/types/order.types";
import { exportToCsv } from "@/utils/exportCsv";

function TruncatedCell({ text }: { text: string }) {
  return (
    <td className="px-4 py-3" style={{ maxWidth: "160px" }}>
      <span
        title={text}
        style={{
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontSize: "13px",
          color: "#4b5563",
        }}
      >
        {text}
      </span>
    </td>
  );
}

function getDefaultFechaInicio() {
  const now = new Date();
  return `${now.getFullYear()}-01-01`;
}

function getDefaultFechaFin() {
  return new Date().toISOString().split("T")[0];
}

export default function HistorialPage() {
  const { user } = useAuth();
  const [data, setData] = useState<OrderHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Valores aplicados 
  const [fechaInicioActiva, setFechaInicioActiva] = useState(
    getDefaultFechaInicio,
  );
  const [fechaFinActiva, setFechaFinActiva] = useState(getDefaultFechaFin);

  // Valores del input 
  const [fechaInicioInput, setFechaInicioInput] = useState(
    getDefaultFechaInicio,
  );
  const [fechaFinInput, setFechaFinInput] = useState(getDefaultFechaFin);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleDescargar = () => {
    const seleccionadas =
      data?.ordenes.filter((o) => selectedRows.has(o.numeroOrden)) ?? [];

    exportToCsv(
      seleccionadas.map((o) => ({
        "No. de orden": o.numeroOrden,
        Nombre: o.nombres,
        Apellidos: o.apellidos,
        Departamento: o.departamento,
        Municipio: o.municipio,
        Paquetes: o.cantidadPaquetes,
      })),
      "ordenes",
    );
  };

  useEffect(() => {
    let cancelled = false;
    getOrderHistory({
      ...(fechaInicioActiva && { fechaInicio: fechaInicioActiva }),
      ...(fechaFinActiva && { fechaFin: fechaFinActiva }),
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
          const msg =
            (err as { message?: string })?.message ??
            "Error al cargar historial";
          setError(msg);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [fechaInicioActiva, fechaFinActiva]);

  const handleBuscar = () => {
    setLoading(true);
    setError(null);
    setFechaInicioActiva(fechaInicioInput);
    setFechaFinActiva(fechaFinInput);
    setSelectedRows(new Set());
    setSelectAll(false);
  };

  const handleClear = () => {
    const inicio = getDefaultFechaInicio();
    const fin = getDefaultFechaFin();
    setFechaInicioInput(inicio);
    setFechaFinInput(fin);
    setFechaInicioActiva(inicio);
    setFechaFinActiva(fin);
    setSelectedRows(new Set());
    setSelectAll(false);
  };

  const hasChanges =
    fechaInicioInput !== fechaInicioActiva || fechaFinInput !== fechaFinActiva;

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
              border: `1.5px solid ${hasChanges ? "#3b5bdb" : "#e5e7eb"}`,
              borderRadius: "8px",
              padding: "8px 12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              transition: "border-color 0.2s",
            }}
          >
            <input
              type="date"
              value={fechaInicioInput}
              onChange={(e) => setFechaInicioInput(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "13px",
                color: "#111",
                background: "transparent",
                width: "130px",
              }}
            />
            <span className="text-gray-300">—</span>
            <input
              type="date"
              value={fechaFinInput}
              onChange={(e) => setFechaFinInput(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "13px",
                color: "#111",
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
            onClick={handleDescargar}
            disabled={selectedRows.size === 0}
            className="text-sm font-medium transition-all"
            style={{
              padding: "9px 16px",
              borderRadius: "8px",
              background: "#fff",
              border: "1.5px solid #e5e7eb",
              cursor: selectedRows.size === 0 ? "not-allowed" : "pointer",
              color: selectedRows.size === 0 ? "#9ca3af" : "#374151",
              opacity: selectedRows.size === 0 ? 0.6 : 1,
            }}
          >
            Descargar órdenes
          </button>

          {/* Limpiar filtros */}
          <button
            onClick={handleClear}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline"
          >
            Limpiar filtros
          </button>
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
            <svg
              className="animate-spin"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeOpacity="0.25"
              />
              <path d="M21 12a9 9 0 00-9-9" />
            </svg>
            <p className="text-sm">Cargando órdenes…</p>
          </div>
        ) : data?.ordenes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2 text-gray-400">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <p className="text-sm">No hay órdenes en este período</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table
              className="w-full"
              style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
            >
              <colgroup>
                <col style={{ width: "40px" }} />
                <col style={{ width: "130px" }} />
                <col style={{ width: "140px" }} />
                <col style={{ width: "140px" }} />
                <col style={{ width: "160px" }} />
                <col style={{ width: "160px" }} />
                <col style={{ width: "140px" }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: "1.5px solid #f3f4f6" }}>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleAll}
                      style={{ cursor: "pointer", accentColor: "#3b5bdb" }}
                    />
                  </th>
                  {[
                    "No. de orden",
                    "Nombre",
                    "Apellidos",
                    "Departamento",
                    "Municipio",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-bold text-gray-900"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {col}
                    </th>
                  ))}
                  <th
                    className="px-4 py-3 text-center text-xs font-bold text-gray-900"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Paquetes en orden
                  </th>
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
                      <TruncatedCell text={order.nombres} />
                      <TruncatedCell text={order.apellidos} />
                      <TruncatedCell text={order.departamento} />
                      <TruncatedCell text={order.municipio} />
                      <td className="px-4 py-3 text-center">
                        <span
                          className="inline-flex items-center justify-center text-xs font-semibold text-green-600"
                          style={{
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            borderRadius: "6px",
                            padding: "2px 10px",
                            minWidth: "28px",
                          }}
                        >
                          {order.cantidadPaquetes}
                        </span>
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
