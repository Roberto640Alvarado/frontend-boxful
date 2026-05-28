import apiClient from "@/lib/apiClient";
import {
  CreateOrderPayload,
  CreateOrderResponse,
  OrderHistoryParams,
  OrderHistoryResponse,
  BalanceResponse,
} from "@/types/order.types";

// Crear una nueva orden de recolección de paquetes
export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  const { data } = await apiClient.post<CreateOrderResponse>("/orders", payload);
  return data;
}

// Obtener el historial de ordenes, con filtros opcionales por fecha
export async function getOrderHistory(params: OrderHistoryParams = {}): Promise<OrderHistoryResponse> {
  const { data } = await apiClient.get<OrderHistoryResponse>("/orders/history", {
    params: {
      ...(params.fechaInicio && { fechaInicio: params.fechaInicio }),
      ...(params.fechaFin && { fechaFin: params.fechaFin }),
    },
  });
  return data;
}

// Obtener el monto acumulado a liquidar del usuario autenticado
export async function getBalance(): Promise<BalanceResponse> {
  const { data } = await apiClient.get<BalanceResponse>("/orders/balance");
  return data;
}