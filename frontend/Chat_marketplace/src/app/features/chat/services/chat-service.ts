import { Injectable, signal } from '@angular/core';
import { ContactItem } from '../models/contact-item';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  //BORRAR DESPUES, Base de datos momentanea para comprobar
  //como se ve en la vista
  readonly contacts = signal<ContactItem[]>([
    { id: 1,  usuario: 'Kenia',      noLeidos: 4 },
    { id: 2,  usuario: 'Genesis',    noLeidos: 1 },
    { id: 3,  usuario: 'Eduardo',    noLeidos: 0 },
    { id: 4,  usuario: 'Josue',      noLeidos: 0 },
    { id: 5,  usuario: 'Abigail',    noLeidos: 0 },
    { id: 6,  usuario: 'Selina',     noLeidos: 0 },
    { id: 7,  usuario: 'David',      noLeidos: 0 },
    { id: 8,  usuario: 'Angel',      noLeidos: 0 },
    { id: 9,  usuario: 'Xcaret',     noLeidos: 0 },
    { id: 10, usuario: 'Fernanda',   noLeidos: 0 },
    { id: 11, usuario: 'Ana Jazmin', noLeidos: 0 },
    { id: 12, usuario: 'Adrian',     noLeidos: 0 },
  ]);
}
