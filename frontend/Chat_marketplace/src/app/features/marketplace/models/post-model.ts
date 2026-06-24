export interface PostModelRequest {
    nombre: string;
    descripcion: string;
    precio: number;
    unidades: number;
    horaDisponible: string;
    puntoEntrega: string;
}

export interface PostModelResponse {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    unidades: number;
    horaDisponible: string;
    puntoEntrega: string;
    imagen?: File | null;
    archivo?: File | null;
}
