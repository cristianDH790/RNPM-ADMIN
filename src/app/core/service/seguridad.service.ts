import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { Usuario } from '../model/usuario';
import { MensajeEstado } from '../util/mensajeEstado';

import { UsuarioFiltro } from '../filter/usuarioFiltro';

import { URL_BACKEND } from '../../config/config';

// import { AuthService } from './auth.service';

import Swal from 'sweetalert2';
import { Perfil } from '../model/perfil';
import { PerfilFiltro } from '../filter/perfilFiltro';
import { AuthService } from './auth.service';


@Injectable()
export class SeguridadService {

  private urlEndPoint: string = URL_BACKEND;
  //   //private urlEndPoint: string = 'http://localhost:8081/educasystem';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router) { }

  private agregarAuthozationHeader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e: any): boolean {
    //No autenticado o no autorizado
    if (e.status == 401) {

      //Validando si el token expiró en el backend
      if (this.authService.isAuthenticated()) {
        this.authService.logout();
      }

      this.router.navigate(['/authentication/login']);
      return true;
    }
    //Acceso prohibido
    if (e.status == 403) {
      Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.login}, no tienes acceso a este recurso!`, 'warning');
      this.router.navigate(['/dashboard/inicio']);
      //this.router.navigate(['/categorias/lista']);
      return true;
    }
    return false;
  }

  //   // Usuario
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(URL_BACKEND + '/usuario/' + id, { headers: this.agregarAuthozationHeader() }).pipe(
      catchError(e => {

        if (e.status == 401) {
          this.router.navigate(['/authentication/login']);
        }
        // this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  getUsuarios(filtro: UsuarioFiltro): Observable<any> {
    return this.http.post(URL_BACKEND + '/usuarios', filtro, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {
          (response.content as Usuario[]).map(usuario => {

            return usuario;
          });
          return response;
        }),
        catchError(e => {

          if (e.status == 401) {
            this.router.navigate(['/authentication/login']);
          }

          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }

          if (e.status == 400) {
            return throwError(e);
          }

          console.error(e.error);
          return throwError(e);
        })
      );
  }



  usuarioGuardar(usuario: Usuario): Observable<Usuario> {
    return this.http.post(URL_BACKEND + "/usuario/guardar", usuario, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.usuario as Usuario),
        catchError(e => {

          if (e.status == 401) {
            this.router.navigate(['/authentication/login']);
          }

          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }

          if (e.status == 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          return throwError(e);
        })
      );
  }

  usuarioActualizar(usuario: Usuario): Observable<any> {
    return this.http.put<any>(URL_BACKEND + `/usuario/guardar/${usuario.idUsuario}`, usuario, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.usuario as Usuario),
        catchError(e => {

          if (e.status == 401) {
            this.router.navigate(['/authentication/login']);
          }

          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }

          if (e.status == 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          return throwError(e);
        })
      );
  }

  usuarioEliminar(idusuario: number): Observable<Usuario> {
    return this.http.delete<Usuario>(URL_BACKEND + '/usuario/eliminar/' + idusuario, { headers: this.agregarAuthozationHeader() }).pipe(
      catchError(e => {

        if (e.status == 401) {
          this.router.navigate(['/authentication/login']);
        }
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  getReporteUsuario(usuarioFiltro: UsuarioFiltro): Observable<any> {
    return this.http.post(this.urlEndPoint + '/usuario/reporte', usuarioFiltro, {
      responseType: "blob",
      headers: this.agregarAuthozationHeader()
    });
  }

  usuarioRecordarAccesos(idUsuario: number) {
    let usuario = {
      "idUsuario": idUsuario
    };
    return this.http.post<Usuario>(URL_BACKEND + '/usuario/envio-correo', usuario, { headers: this.agregarAuthozationHeader() }).pipe(
      catchError(e => {

        if (e.status == 401) {
          this.router.navigate(['/authentication/login']);
        }
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  usuarioRecuperarClave(login: string): Observable<any> {

    return this.http.get<any>(URL_BACKEND + '/usuario/recuperarclave/' + login)
      .pipe(
        catchError(e => {

          if (e.status == 401) {
            this.router.navigate(['/authentication/login']);
          }

          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }

          if (e.status == 400) {
            return throwError(e);
          }

          console.error(e.error.mensaje);
          return throwError(e);
        })
      );
  }



  // PERFIL
  getPerfil(id: number): Observable<Perfil> {
    return this.http.get<Perfil>(this.urlEndPoint + '/perfil/' + id, { headers: this.agregarAuthozationHeader() }).pipe(
      catchError(e => {

        if (e.status == 401) {
          this.router.navigate(['/authentication/login']);
        }
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        console.error(e.error);
        return throwError(e);
      })
    );
  }

  getPerfiles(filtro: PerfilFiltro): Observable<any> {
    return this.http.post(this.urlEndPoint + '/perfiles', filtro, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {
          (response.content as Perfil[]).map(perfil => {
            perfil.nombre = perfil.nombre.toUpperCase();

            return perfil;
          });
          return response;
        }),
        //-- Seguridad - Inicio
        catchError(e => {

          if (e.status == 401) {
            this.router.navigate(['/authentication/login']);
          }
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }

          if (e.status == 400) {
            return throwError(e);
          }

          console.error(e.error);
          return throwError(e);
        })
        //-- Seguridad - Fin
      );
  }

  perfilGuardar(perfil: Perfil): Observable<Perfil> {
    return this.http.post(this.urlEndPoint + "/perfil/guardar", perfil, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.perfil as Perfil),
        catchError(e => {

          if (e.status == 401) {
            this.router.navigate(['/authentication/login']);
          }
          //-- Seguridad - Inicio
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          //-- Seguridad - Fin

          if (e.status == 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          return throwError(e);
        })
      );
  }

  perfilActualizar(perfil: Perfil): Observable<any> {
    return this.http.put<any>(this.urlEndPoint + `/perfil/guardar/${perfil.idPerfil}`, perfil, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.perfil as Perfil),
        catchError(e => {

          if (e.status == 401) {
            this.router.navigate(['/authentication/login']);
          }

          //-- Seguridad - Inicio
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          //-- Seguridad - Fin

          if (e.status == 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          return throwError(e);
        })
      );
  }
  /*
    perfilEliminar(idPerfil: Number): Observable<Perfil> {
      return this.http.delete<Perfil>(this.urlEndPoint + '/perfil/eliminar/' + idPerfil, { headers: this.agregarAuthozationHeader() }).pipe(
        catchError(err =>  {

          //-- Seguridad - Inicio
          if (this.isNoAutorizado(err)) {
            return throwError(err);
          }
          //-- Seguridad - Fin

        })
      );
    }
  */






}
