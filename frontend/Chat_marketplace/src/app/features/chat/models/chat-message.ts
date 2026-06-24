export type EstadoMensaje = 'enviado' | 'pendiente';
export type TipoMensaje = 'texto' | 'imagen' | 'archivo';

export interface ChatMessage {
    id: string;
    emisorId: string;
    receptorId: string;
    texto: string;
    tipo: TipoMensaje;
    archivoUrl?: string;
    fecha: string;
    estado: EstadoMensaje;
}