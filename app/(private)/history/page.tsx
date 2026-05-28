"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getOrderHistory, getBalance } from "@/services/orderService";
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

export default function HistorialPage() {
  const { user } = useAuth();
  const [data, setData] = useState<OrderHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [buscado, setBuscado] = useState(false);

  const [fechaInicioInput, setFechaInicioInput] = useState("");
  const [fechaFinInput, setFechaFinInput] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Polling balance cada 30 segundos
  useEffect(() => {
    const fetchBalance = () => {
      getBalance()
        .then((res) => setBalance(res.balance))
        .catch(() => setBalance(null));
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const handleBuscar = () => {
    setLoading(true);
    setError(null);
    setSelectedRows(new Set());
    setSelectAll(false);
    setBuscado(true);

    getOrderHistory({
      ...(fechaInicioInput && { fechaInicio: fechaInicioInput }),
      ...(fechaFinInput && { fechaFin: fechaFinInput }),
    })
      .then((res) => {
        setData(res);
        setError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        const msg =
          (err as { message?: string })?.message ?? "Error al cargar historial";
        setError(msg);
        setLoading(false);
      });
  };

  const handleClear = () => {
    setFechaInicioInput("");
    setFechaFinInput("");
    setSelectedRows(new Set());
    setSelectAll(false);
    setData(null);
    setBuscado(false);
    setError(null);
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

        <div className="flex items-center gap-3">
          {balance !== null && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{
                background: "#f0fdf4",
                border: "1.5px solid #bbf7d0",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_hist)">
                  <path d="M18 4H6C3.79 4 2 5.79 2 8V16C2 18.21 3.79 20 6 20H18C20.21 20 22 18.21 22 16V8C22 5.79 20.21 4 18 4ZM16.14 13.77C15.9 13.97 15.57 14.05 15.26 13.97L4.15 11.25C4.45 10.52 5.16 10 6 10H18C18.67 10 19.26 10.34 19.63 10.84L16.14 13.77ZM6 6H18C19.1 6 20 6.9 20 8V8.55C19.41 8.21 18.73 8 18 8H6C5.27 8 4.59 8.21 4 8.55V8C4 6.9 4.9 6 6 6Z" fill="#1A5656"/>
                </g>
                <defs>
                  <clipPath id="clip0_hist">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <span className="text-xs font-medium text-green-700">
                Monto a liquidar{" "}
                <strong className="text-green-800">
                  $ {balance.toFixed(2)}
                </strong>
              </span>
            </div>
          )}

          {user && (
            <span className="text-sm font-medium text-gray-600">
              {user.nombre} {user.apellido}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-10 py-6 md:py-8">
        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
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

        {/* Estado inicial - esperando búsqueda */}
        {!buscado && !loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-2 text-gray-400">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <p className="text-sm">Ingresa un rango de fechas y presiona Buscar</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25" />
              <path d="M21 12a9 9 0 00-9-9" />
            </svg>
            <p className="text-sm">Cargando órdenes…</p>
          </div>
        )}

        {/* Sin resultados */}
        {buscado && !loading && data?.ordenes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-2 text-gray-400">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <p className="text-sm">No hay órdenes en este período</p>
          </div>
        )}

        {/* Tabla */}
        {buscado && !loading && data && data.ordenes.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full" style={{ borderCollapse: "collapse", tableLayout: "fixed" }}>
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
                  {["No. de orden", "Nombre", "Apellidos", "Departamento", "Municipio"].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-bold text-gray-900"
                      style={{ whiteSpace: "nowrap" }}>
                      {col}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-900"
                    style={{ whiteSpace: "nowrap" }}>
                    Paquetes en orden
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.ordenes.map((order: OrderSummary) => {
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