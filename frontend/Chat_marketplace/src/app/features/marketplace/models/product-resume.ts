export type DisponibilidadEstado = 'disponible' | 'pocas' | 'agotado';

export interface ProductResume {
    id: string;
    nombreProducto: string;
    precio: number;
    imagenUrl: string;
    estado: DisponibilidadEstado;
    piezasRestantes?: number | null;
    likeado: boolean;
    favorito: boolean;
}