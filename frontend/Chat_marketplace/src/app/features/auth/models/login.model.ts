import { Usuario } from "./usuario.model";

export interface PeticionLogin{
    userName: string;
    password: string;
}

export interface PeticionRegistro{
    correo: string;
    userName: string;
    password: string;
    confirmPassword: string;
}
export interface RespuestaAuth{
    token: string;
    usuario: Usuario;
}