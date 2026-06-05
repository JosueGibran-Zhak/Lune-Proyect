import { Component, input, output} from '@angular/core';
/*input
  --Permite recibir datos a este componente 

  output
  --Permite enviar datos a otros componentes
  */
import {MatButtonModule} from '@angular/material/button';
/*MatButtonModule permite usar los botones estilizados de Angular Material */

@Component({
  selector: 'app-main-button',
  imports: [MatButtonModule],
  template: ` <button matButton="elevated" class="btn-main"
              type="button"
              (click)="onClick()" 
              [disabled]="desabilitado()"
              >
              {{texto()}}
              </button> `,
  styles: `
    @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');

    .btn-main{  
      color: #F5F5F5 !important;
      background: linear-gradient(to right, #2A74FE, #949AFD) !important;
      border: 1px solid #0005 !important;
      border-radius: 10px !important;
      width: 150px;
      margin: 0;

      font-family: "Lato", sans-serif;
      font-size: 1rem;
    }
  
  `,
})
export class MainButton {

  texto = input('Botón');
  desabilitado = input(false);

  clickeado = output<void>();

  onClick(): void {
    this.clickeado.emit();
  }

}
