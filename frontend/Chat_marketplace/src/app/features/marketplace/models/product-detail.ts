export interface ProductSeller {
    id: string;
    userName: string;
    correo: string;
}

export interface ProductDetail {
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

    vendedor: ProductSeller;
}

export interface ComprarProductoRequest {
    cantidad: number;
}