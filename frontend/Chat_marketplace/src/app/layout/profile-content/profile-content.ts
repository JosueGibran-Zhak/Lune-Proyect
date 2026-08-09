import { Component, OnInit, inject } from '@angular/core';
import { UserProfileService } from '../../features/perfil/services/user-profile-service';
import { AuthService } from '../../features/auth/services/auth-service';

@Component({
  selector: 'app-profile-content',
  imports: [],
  template: ` 
    @if (perfil()) {
      <section class="profile-content">
        <img
          class="avatar"
          [src]="perfil()!.avatarUrl"
          alt="Foto de perfil"
        >

        <div class="info-card">
          <p>
            <span>Nombre de usuario:</span>
            {{ perfil()!.nombre }}
          </p>

          <p>
            <span>ID:</span>
            {{ perfil()!.id }}
          </p>
        </div>
      </section>

      <section class="card">
        <h3>Datos adicionales opcionales:</h3>

        <div class="telefono">
          <label>Teléfono:</label>
          <input
            type="tel"
            placeholder="971 123 456"
            [value]="telefono()"
            (input)="actualizarTelefono($any($event.target).value)"
          >

          @if (errorTelefono()) {
            <small class="error">{{ errorTelefono() }}</small>
          }
        </div>

        <h3>Redes sociales</h3>

        <div class="red-social">
          <img src="assets/social-media/instagram.png" alt="Instagram">
          <input
            type="text"
            placeholder="@anyma"
            [value]="instagram()"
            (input)="actualizarInstagram($any($event.target).value)"
          >
        </div>

        @if (errorInstagram()) {
          <small class="error">{{ errorInstagram() }}</small>
        }

        <div class="red-social">
          <img src="assets/social-media/facebook.png" alt="Facebook">
          <input
            type="text"
            placeholder="Anyma"
            [value]="facebook()"
            (input)="actualizarFacebook($any($event.target).value)"
          >
        </div>

        @if (errorFacebook()) {
          <small class="error">{{ errorFacebook() }}</small>
        }

        <div class="red-social">
          <img src="assets/social-media/tiktok.png" alt="TikTok">
          <input
            type="text"
            placeholder="@anyma.official"
            [value]="tiktok()"
            (input)="actualizarTiktok($any($event.target).value)"
          >
        </div>

        @if (errorTiktok()) {
          <small class="error">{{ errorTiktok() }}</small>
        }
        @if(puedoGuardar()){
          <button
            type="button"
            class="btn-guardar"
            [disabled]="cargando()"
            (click)="guardarCambios()"
          >
            {{cargando() ? 'Guardando': 'Guardar Cambios'}}
          </button>
        }

        @if (mensajeExito()) {
          <p class="exito">{{ mensajeExito() }}</p>
        }
      </section>

      <div class="logout-card">
        <button
          class="btn-cerrar-sesion"
          type="button"
          (click)="cerrarSesion()"
        >
          Cerrar sesión
        </button>
      </div>
    } @else {
      <p>Cargando perfil...</p>
    }
  `,
  styleUrl: './profile-content.scss',
})
export class ProfileContent implements OnInit {
  private userProfileService = inject(UserProfileService);
  private authService = inject(AuthService);

  perfil = this.userProfileService.perfil;

  telefono = this.userProfileService.telefono;
  instagram = this.userProfileService.instagram;
  facebook = this.userProfileService.facebook;
  tiktok = this.userProfileService.tiktok;

  errorTelefono = this.userProfileService.errorTelefono;
  errorInstagram = this.userProfileService.errorInstagram;
  errorFacebook = this.userProfileService.errorFacebook;
  errorTiktok = this.userProfileService.errorTiktok;

  mensajeExito = this.userProfileService.mensajeExito;
  cargando = this.userProfileService.cargando;
  
  // Referencia directa a la signal
  puedoGuardar = this.userProfileService.puedoGuardar;

  ngOnInit(): void {
    this.userProfileService.cargarPerfil();
  }

  actualizarTelefono(valor: string): void {
    this.userProfileService.actualizarTelefono(valor);
  }

  actualizarInstagram(valor: string): void {
    this.userProfileService.actualizarInstagram(valor);
  }

  actualizarFacebook(valor: string): void {
    this.userProfileService.actualizarFacebook(valor);
  }

  actualizarTiktok(valor: string): void {
    this.userProfileService.actualizarTiktok(valor);
  }

  guardarCambios(): void {
    this.userProfileService.guardarCambios();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
  }
}