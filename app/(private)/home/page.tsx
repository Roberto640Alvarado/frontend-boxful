"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import OrderForm from "@/components/forms/OrderForm";
import PackagesForm from "@/components/forms/PackagesForm";
import { getBalance } from "@/services/orderService";

export type OrderDraft = {
  direccionRecoleccion: string;
  fechaProgramada: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  codigoPais: string;
  direccionDestinatario: string;
  departamento: string;
  municipio: string;
  puntoReferencia: string;
  indicaciones: string;
  isCOD: boolean;
  expectedAmount: number;
};

export default function HomePage() {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [orderDraft, setOrderDraft] = useState<OrderDraft | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

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

  const handleOrderNext = (data: OrderDraft) => {
    setOrderDraft(data);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleReset = () => {
    setOrderDraft(null);
    setStep(1);
    sessionStorage.removeItem("order_paquetes");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-10 py-4 flex items-center justify-between">
        <h1 className="text-base md:text-lg font-semibold text-gray-800">
          Crear un <strong>envío</strong>
        </h1>

        <div className="flex items-center gap-3">
          {/* Badge balance */}
          {balance !== null && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{
                background: "#f0fdf4",
                border: "1.5px solid #bbf7d0",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2103_544)">
                  <path
                    d="M18 4H6C3.79 4 2 5.79 2 8V16C2 18.21 3.79 20 6 20H18C20.21 20 22 18.21 22 16V8C22 5.79 20.21 4 18 4ZM16.14 13.77C15.9 13.97 15.57 14.05 15.26 13.97L4.15 11.25C4.45 10.52 5.16 10 6 10H18C18.67 10 19.26 10.34 19.63 10.84L16.14 13.77ZM6 6H18C19.1 6 20 6.9 20 8V8.55C19.41 8.21 18.73 8 18 8H6C5.27 8 4.59 8.21 4 8.55V8C4 6.9 4.9 6 6 6Z"
                    fill="#1A5656"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2103_544">
                    <rect width="24" height="24" fill="white" />
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

          {/* Nombre usuario */}
          {user && (
            <span className="text-sm font-medium text-gray-600">
              {user.nombre} {user.apellido}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-10 py-6 md:py-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
          Crea una orden
        </h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Dale una ventaja competitiva a tu negocio con entregas{" "}
          <strong className="text-gray-700">el mismo día</strong>{" "}
          <span className="text-gray-400">(Área Metropolitana)</span> y{" "}
          <strong className="text-gray-700">el día siguiente</strong> a nivel
          nacional.
        </p>

        {step === 1 && (
          <OrderForm onNext={handleOrderNext} initialData={orderDraft} />
        )}
        {step === 2 && orderDraft && (
          <PackagesForm
            orderDraft={orderDraft}
            onBack={handleBack}
            onCreateAnother={handleReset}
          />
        )}
      </div>
    </div>
  );
}
