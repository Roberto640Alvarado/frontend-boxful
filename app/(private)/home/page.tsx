"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import OrderForm from "@/components/OrderForm";
import PackagesForm from "@/components/PackagesForm";

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
};

export default function HomePage() {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [orderDraft, setOrderDraft] = useState<OrderDraft | null>(null);

  const handleOrderNext = (data: OrderDraft) => {
    setOrderDraft(data);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-10 py-4 flex items-center justify-between">
        <h1 className="text-base md:text-lg font-semibold text-gray-800">Crear orden</h1>
        {user && (
          <span className="text-sm font-medium text-gray-600">
            {user.nombre} {user.apellido}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-6 md:px-10 py-6 md:py-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Crea una orden</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Dale una ventaja competitiva a tu negocio con entregas{" "}
          <strong className="text-gray-700">el mismo día</strong>{" "}
          <span className="text-gray-400">(Área Metropolitana)</span>{" "}
          y{" "}
          <strong className="text-gray-700">el día siguiente</strong>{" "}
          a nivel nacional.
        </p>

        {step === 1 && <OrderForm onNext={handleOrderNext} />}
        {step === 2 && orderDraft && (
          <PackagesForm orderDraft={orderDraft} onBack={() => setStep(1)} />
        )}
      </div>
    </div>
  );
}