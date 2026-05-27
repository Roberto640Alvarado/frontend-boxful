export interface RegisterPayload {
  nombre: string;
  apellido: string;
  sexo: "M" | "F";
  fechaNacimiento: string;
  correo: string;
  telefono: string;
  password: string;
}

export interface RegisterResponse {
  mensaje: string;
  usuario: {
    id: string;
    nombre: string;
    correo: string;
  };
}

export interface LoginPayload {
  correo: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  nombre: string;
}

export interface WhoAmIResponse {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  sexo: "M" | "F";
  telefono: string;
  fechaNacimiento: string;
  createdAt: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
}