import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_BACKEND } from '../../config/config';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Formacion } from '../model/formacion';
import { FormacionFiltro } from '../filter/formacionFiltro';
import { Proyecto } from '../model/proyecto';
@Injectable()
export class FormacionService {

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

  getFormacion(id: number): Observable<Formacion> {
      return this.http.get<Formacion>(this.urlEndPoint + '/formacion/' + id, { headers: this.agregarAuthozationHeader() }).pipe(
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

    getFormaciones(filtro: FormacionFiltro): Observable<any> {
      return this.http.post(this.urlEndPoint + '/formacion', filtro, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => {
            (response.content as Proyecto[]).map(formacion => {
              return formacion;
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


    formacionGuardar(formacion: Formacion): Observable<Formacion> {
      return this.http.post(this.urlEndPoint + "/formacion/guardar", formacion, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.formacion as Formacion),
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

    formacionUpload(archivo: File, idFormacion: number): Observable<Formacion> {

      let formData = new FormData();
      formData.append("archivo", archivo);
      formData.append("idFormacion", idFormacion.toString());

      return this.http.post(this.urlEndPoint + "/formacion/upload", formData, { headers: this.agregarAuthozationHeaderFormData() }).pipe(
        map((response: any) => response.formacion as Formacion),
        catchError(e => {

          if (e.status == 401) {
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

    formacionActualizar(formacion: Formacion): Observable<any> {
      return this.http.put<any>(this.urlEndPoint + `/formacion/guardar/${formacion.idFormacion}`, formacion, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.formacion as Formacion),
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


    formacionEliminarImagen(formacion: Formacion): Observable<any> {

      let data = { "idFormaciom": formacion.idFormacion };

      return this.http.post<any>(this.urlEndPoint + `/formacion/eliminar-imagen`, data, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.formacion as Formacion),
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

    formacionEliminar(idFormacion: number): Observable<Formacion> {
      return this.http.delete<Formacion>(this.urlEndPoint + '/formacion/eliminar/' + idFormacion, { headers: this.agregarAuthozationHeader() }).pipe(
        catchError(e => {

          if (e.status == 401) {
            this.router.navigate(['/authentication/login']);
          }

          //-- Seguridad - Inicio
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          //-- Seguridad - Fin

          if (e.status != 200) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          return throwError(e);
        })
      );
    }

}
