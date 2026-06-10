//Tarjeta resumen de la publicacion

export type DisponibilidadEstado = 'disponible' | 'pocas' | 'agotado';

export interface ProductResume {
    id: number;
    nombreProducto: string;
    precio: number;
    imagenUrl: string;
    estado: DisponibilidadEstado;
    piezasRestantes?: number;
    likeado: boolean;
    favorito: boolean;
}
