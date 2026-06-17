export interface ChatMessage {
    id: number;
    contactId: number;
    texto: string;
    hora: string;
    enviadoPorMi: boolean;
}