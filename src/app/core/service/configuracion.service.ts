import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_BACKEND } from '../../config/config';
import { Configuracion } from '../model/configuracion';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ConfiguracionFiltro } from '../filter/configuracionFiltro';

@Injectable()
export class ConfiguracionService {

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

//Configuracion-------------------------------------
  getConfiguracion(id:any): Observable<Configuracion> {
    return this.http.get<Configuracion>(this.urlEndPoint + '/configuracion/' + id, { headers: this.agregarAuthozationHeader() }).pipe(
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

  getConfiguraciones(filtro: ConfiguracionFiltro) : Observable<any> {
    return this.http.post(this.urlEndPoint + '/configuraciones', filtro, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {
          (response.content as Configuracion[]).map(configuracion => {
            return configuracion;
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

  configuracionGuardar(configuracion: Configuracion): Observable<Configuracion> {
    return this.http.post(this.urlEndPoint + "/configuracion/guardar", configuracion, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.configuracion as Configuracion),
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

  configuracionActualizar(configuracion: Configuracion): Observable<any> {
    return this.http.put<any>(this.urlEndPoint + `/configuracion/guardar/${configuracion.idConfiguracion}`, configuracion, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.configuracion as Configuracion),
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

  configuracionEliminar(idConfiguracion: Number): Observable<Configuracion> {
    return this.http.delete<Configuracion>(this.urlEndPoint + '/configuracion/eliminar/' + idConfiguracion, { headers: this.agregarAuthozationHeader() }).pipe(
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

  configuracionUpload(archivo: File, idConfiguracion: number): Observable<Configuracion> {

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("idConfiguracion", idConfiguracion.toString());



    return this.http.post(this.urlEndPoint + "/configuracion/upload", formData ,{ headers: this.agregarAuthozationHeaderFormData() }).pipe(
      map((response: any) => response.configuracion as Configuracion),
      catchError(e => {

          if(e.status==401){
            this.router.navigate(['/authentication/login']);
          }
        console.error(e.error.mensaje);
        Swal.fire(
          e.error.mensaje,
          e.error.error,
          'error'
        )
        return throwError(e);
      })
    );
  }


  configuracionEliminarImagen(configuracion: Configuracion): Observable<any> {
    let data={"idConfiguracion":configuracion.idConfiguracion};
    return this.http.post<any>(this.urlEndPoint + `/configuracion/eliminar-imagen`,data, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.configuracion as Configuracion),
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
