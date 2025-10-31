import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_BACKEND } from '../../config/config';
import { ContenidoWeb } from '../model/contenidoWeb';
import { ContenidoWebFiltro } from '../filter/contenidoWebFiltro';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class ContenidoWebService {

  private urlEndPoint: string = URL_BACKEND;

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  private httpHeadersFormData = new HttpHeaders();

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router) { }


  //Seguridad
  private agregarAuthozationHeader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private agregarAuthozationHeaderFormData() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeadersFormData.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }


  private agregarAuthozationHeaderUpload() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeadersFormData.append('Authorization', 'Bearer ' + token);
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
      return true;
    }
    return false;
  }


 // Contenido web
  getContenidoWeb(id: number): Observable<ContenidoWeb> {
    return this.http.get<ContenidoWeb>(this.urlEndPoint + '/contenidoWeb/' + id, { headers: this.agregarAuthozationHeader() }).pipe(
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

  getContenidosWeb(contenidoWebFiltro: ContenidoWebFiltro): Observable<any> {
    return this.http.post(this.urlEndPoint + '/contenidosWeb', contenidoWebFiltro, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {
          (response.content as ContenidoWeb[]).map(contenido => {

            return contenido;
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

  contenidoWebGuardar(contenidoWeb: ContenidoWeb): Observable<ContenidoWeb> {
    return this.http.post(this.urlEndPoint + "/contenidoWeb/guardar", contenidoWeb, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.contenidoWeb as ContenidoWeb),
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

  contenidoWebActualizar(contenidoWeb: ContenidoWeb): Observable<any> {
    return this.http.put<any>(this.urlEndPoint + `/contenidoWeb/guardar/${contenidoWeb.idContenidoWeb}`, contenidoWeb, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.contenidoWeb as ContenidoWeb),
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

  contenidoWebEliminar(idContenidoWeb: Number): Observable<ContenidoWeb> {
    return this.http.delete<ContenidoWeb>(this.urlEndPoint + '/contenidoWeb/eliminar/' + idContenidoWeb, { headers: this.agregarAuthozationHeader() }).pipe(
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

}
