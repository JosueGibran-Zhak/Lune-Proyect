export interface PostModelRequest {
    nombre: string;
    descripcion: string;
    precio: number;
    unidades: number;
    horaDisponible: string;
    puntoEntrega: string;
    imagen: File;
    archivo?: File | null;
}

export interface PostModelResponse {
    id: string;
    usuarioId: string;
    nombre: string;
    descripcion: string;
    precio: number;
    unidades: number;
    horaDisponible: string;
    puntoEntrega: string;
    imagenUrl: string;
    archivoUrl?: string;
    fechaCreacion: string;
    likeado: boolean;
    favorito: boolean;
}