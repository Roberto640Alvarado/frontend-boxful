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
  puntoReferencia: string;
  indicaciones: string;
  paquetes: Paquete[];
}

export interface OrdenResponse {
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
  puntoReferencia: string;
  indicaciones: string;
  cantidadPaquetes: number;
  paquetes: PaqueteResponse[];
  creadoEn: string;
}

export interface CreateOrderResponse {
  mensaje: string;
  orden: OrdenResponse;
}

export interface OrdenHistorial {
  numeroOrden: number;
  nombres: string;
  apellidos: string;
  departamento: string;
  municipio: string;
  cantidadPaquetes: number;
  creadoEn: string;
}

export interface OrderHistoryParams {
  fechaInicio?: string;
  fechaFin?: string;
}

export interface OrderHistoryResponse {
  total: number;
  filtros: {
    fechaInicio?: string;
    fechaFin?: string;
  };
  ordenes: OrdenHistorial[];
}