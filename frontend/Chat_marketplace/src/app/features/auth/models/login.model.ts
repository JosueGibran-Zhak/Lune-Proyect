import { Usuario } from "./usuario.model";

export interface PeticionLogin{
    userName: string;
    password: string;
}
export interface RespuestaLogin {
    token: string;
    usuario: Usuario;
}