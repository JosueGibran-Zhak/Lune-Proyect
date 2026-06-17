export interface PostModelRequest {
    nombre: string;
    descripcion: string;
    precio: number;
    unidades: number;
    horaDisponible: string;
    puntoEntrega: string;
    telefono?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    imagen?: File | null;
    archivo?: File | null;
}

export interface PostModelResponse {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    unidades: number;
    horaDisponible: string;
    puntoEntrega: string;
    telefono?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    imagen?: File | null;
    archivo?: File | null;
}
