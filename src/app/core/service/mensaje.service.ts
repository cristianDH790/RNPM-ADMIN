import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_BACKEND } from '../../config/config';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Mensaje } from '../model/mensaje';
import { MensajeFiltro } from '../filter/mensajeFiltro';

@Injectable()
export class MensajeService {

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

 //Mensaje

  getMensaje(id:number): Observable<Mensaje> {
    return this.http.get<Mensaje>(this.urlEndPoint + '/mensaje/' + id, { headers: this.agregarAuthozationHeader() }).pipe(
      catchError(e => {

          if(e.status==401){
            this.router.navigate(['/authentication/login']);
          }
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        return throwError(e);
      })
    );
  }


  getMensajes(filtro: MensajeFiltro): Observable<any> {
    return this.http.post(this.urlEndPoint + '/mensajes', filtro, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {
          (response.content as Mensaje[]).map(mensaje => {
            return mensaje;
          });
          return response;
        }),
        catchError(e => {

          if(e.status==401){
            this.router.navigate(['/authentication/login']);
          }

          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }

          if (e.status == 400) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  mensajeGuardar(mensaje: Mensaje): Observable<Mensaje> {
    return this.http.post(this.urlEndPoint + "/mensaje/guardar", mensaje, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.mensaje as Mensaje),
        catchError(e => {

          if(e.status==401){
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

  mensajeActualizar(mensaje: Mensaje): Observable<any> {
    return this.http.put<any>(this.urlEndPoint + `/mensaje/guardar/${mensaje.idMensaje}`, mensaje, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.mensaje as Mensaje),
        catchError(e => {

          if(e.status==401){
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

  mensajeEliminar(idMensaje: Number): Observable<Mensaje> {
    return this.http.delete<Mensaje>(this.urlEndPoint + '/mensaje/eliminar/' + idMensaje, { headers: this.agregarAuthozationHeader() }).pipe(
       catchError(e => {

          if(e.status==401){
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
