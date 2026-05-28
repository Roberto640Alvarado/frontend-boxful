export interface Paquete {
  largo: number;
  alto: number;
  ancho: number;
  peso: number;
  contenido: string;
}

export interface PaqueteResponse extends Paquete {
  id: string;
}

export interface CreateOrderPayload {
  direccionRecoleccion: string;
  fechaProgramada: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  direccionDestinatario: string;
  departamento: string;
  municipio: string;
  puntoReferencia?: string;
  indicaciones?: string;
  isCOD?: boolean;
  expectedAmount?: number;
  paquetes: Paquete[];
}

export interface CreateOrderResponse {
  mensaje: string;
  orden: {
    numeroOrden: number;
    direccionRecoleccion: string;
    fechaProgramada: string;
    nombres: string;
    apellidos: string;
    correo: string;
    telefono: string;
    direccionDestinatario: string;
    departamento: string;
    municipio: string;
    puntoReferencia?: string;
    indicaciones?: string;
    cantidadPaquetes: number;
    paquetes: PaqueteResponse[];
    isCOD: boolean;
    expectedAmount?: number;
    shippingCost?: number;
    status: "pending" | "delivered";
    creadoEn: string;
  };
}

export interface OrderHistoryParams {
  fechaInicio?: string;
  fechaFin?: string;
}

export interface OrderSummary {
  numeroOrden: number;
  nombres: string;
  apellidos: string;
  departamento: string;
  municipio: string;
  cantidadPaquetes: number;
  creadoEn: string;
}

export interface OrderHistoryResponse {
  total: number;
  filtros: {
    fechaInicio?: string;
    fechaFin?: string;
  };
  ordenes: OrderSummary[];
}

export interface BalanceResponse {
  balance: number;
}