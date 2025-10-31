import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_BACKEND } from '../../config/config';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Alianza } from '../model/alianza';
import { AlianzaFiltro } from '../filter/alianzaFiltro';

@Injectable()
export class AlianzaService {

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

  //alianza
   getAlianza(id: number): Observable<Alianza> {
    return this.http.get<Alianza>(this.urlEndPoint + '/alianza/' + id, { headers: this.agregarAuthozationHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        console.error(e.error);
        return throwError(e);
      })
    );
  }

  getAlianzas(alianzaFiltro: AlianzaFiltro): Observable<any> {
    return this.http.post(this.urlEndPoint + '/alianzas', alianzaFiltro, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {
          (response.content as Alianza[]).map(alianza => {
            alianza.nombre = alianza.nombre.toUpperCase();

            return alianza;
          });
          return response;
        }),
        //-- Seguridad - Inicio
        catchError(e => {
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

  alianzaGuardar(alianza: Alianza): Observable<Alianza> {
    return this.http.post(this.urlEndPoint + "/alianza/guardar", alianza, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.alianza as Alianza),
        catchError(e => {
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

 alianzaActualizar(alianza: Alianza): Observable<any> {
    return this.http.put<any>(this.urlEndPoint + `/alianza/guardar/${alianza.idAlianza}`, alianza, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.alianza as Alianza),
        catchError(e => {

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

  alianzaEliminar(idAlianza: Number): Observable<Alianza> {
    return this.http.delete<Alianza>(this.urlEndPoint + '/alianza/eliminar/' + idAlianza, { headers: this.agregarAuthozationHeader() }).pipe(
      catchError(e => {

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

  alianzaUpload(archivo: File, idAlianza: number): Observable<Alianza> {

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("idAlianza", idAlianza.toString());

    return this.http.post(this.urlEndPoint + "/alianza/upload", formData, { headers: this.agregarAuthozationHeaderFormData() }).pipe(
      map((response: any) => response.alianza as Alianza),
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


  alianzaEliminarImagen(alianza: Alianza): Observable<any> {
    let data = { "idAlianza": alianza.idAlianza };
    return this.http.post<any>(this.urlEndPoint + `/alianza/eliminar-imagen`, data, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.alianza as Alianza),
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
