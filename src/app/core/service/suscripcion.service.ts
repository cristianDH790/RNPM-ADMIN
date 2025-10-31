import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Suscripcion } from '../model/suscripcion';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { URL_BACKEND } from '../../config/config';
import { SuscripcionFiltro } from '../filter/suscripcionFiltro';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Injectable()
export class SuscripcionService {

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



  // Suscripcion
  getSuscripcion(id: number): Observable<Suscripcion> {
    return this.http.get<Suscripcion>(this.urlEndPoint + '/suscripcion/' + id, { headers: this.agregarAuthozationHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        console.error(e.error);
        return throwError(e);
      })
    );
  }

  getSuscripciones(suscripcionFiltro: SuscripcionFiltro): Observable<any> {
    return this.http.post(this.urlEndPoint + '/suscripciones', suscripcionFiltro, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {
          (response.content as Suscripcion[]).map(suscripcion => {
            return suscripcion;
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

  suscripcionGuardar(suscripcion: Suscripcion): Observable<Suscripcion> {
    return this.http.post(this.urlEndPoint + "/suscripcion/guardar", suscripcion, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.suscripcion as Suscripcion),
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

  suscripcionActualizar(suscripcion: Suscripcion): Observable<any> {
    return this.http.put<any>(this.urlEndPoint + `/suscripcion/guardar/${suscripcion.idSuscripcion}`, suscripcion, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.suscripcion as Suscripcion),
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

  suscripcionEliminar(idSuscripcion: Number): Observable<Suscripcion> {
    return this.http.delete<Suscripcion>(this.urlEndPoint + '/suscripcion/eliminar/' + idSuscripcion, { headers: this.agregarAuthozationHeader() }).pipe(
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

  getReporteSuscripcion(suscripcionFiltro: SuscripcionFiltro): Observable<any> {
    return this.http.post(this.urlEndPoint + '/suscripcion/reporte', suscripcionFiltro, {
      responseType: "blob",
      headers: this.agregarAuthozationHeader()
    });
  }



}
