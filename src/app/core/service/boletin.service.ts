import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_BACKEND } from '../../config/config';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Boletin } from '../model/boletin';
import { BoletinFiltro } from '../filter/boletinFiltro';

@Injectable()
export class BoletinService {

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

  //boletin
  getBoletin(id: number): Observable<Boletin> {
    return this.http.get<Boletin>(this.urlEndPoint + '/boletin/' + id, { headers: this.agregarAuthozationHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        console.error(e.error);
        return throwError(e);
      })
    );
  }

  getBoletines(boletinFiltro: BoletinFiltro): Observable<any> {
    return this.http.post(this.urlEndPoint + '/boletines', boletinFiltro, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {
          (response.content as Boletin[]).map(boletin => {
            boletin.nombre = boletin.nombre.toUpperCase();

            return boletin;
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

  boletinGuardar(boletin: Boletin): Observable<Boletin> {
    console.log(boletin);
    return this.http.post(this.urlEndPoint + "/boletin/guardar", boletin, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.boletin as Boletin),
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

  boletinActualizar(boletin: Boletin): Observable<any> {
    return this.http.put<any>(this.urlEndPoint + `/boletin/guardar/${boletin.idBoletin}`, boletin, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.boletin as Boletin),
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

  boletinEliminar(idBoletin: Number): Observable<Boletin> {
    return this.http.delete<Boletin>(this.urlEndPoint + '/boletin/eliminar/' + idBoletin, { headers: this.agregarAuthozationHeader() }).pipe(
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

  boletinUpload(archivo: File, idBoletin: number): Observable<Boletin> {

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("idBoletin", idBoletin.toString());

    return this.http.post(this.urlEndPoint + "/boletin/upload", formData, { headers: this.agregarAuthozationHeaderFormData() }).pipe(
      map((response: any) => response.boletin as Boletin),
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

  boletinUploadPdf(archivo: File, idBoletin: number): Observable<Boletin> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("idBoletin", idBoletin.toString());

    return this.http.post(this.urlEndPoint + "/boletin/uploadpdf", formData, { headers: this.agregarAuthozationHeaderFormData() }).pipe(
      map((response: any) => response.boletin as Boletin),
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

  boletinEliminarImagen(boletin: Boletin): Observable<any> {
    let data = { "idBoletin": boletin.idBoletin };
    return this.http.post<any>(this.urlEndPoint + `/boletin/eliminar-imagen`, data, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.boletin as Boletin),
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
  boletinEliminarPdf(boletin: Boletin): Observable<any> {
    let data = { "idBoletin": boletin.idBoletin };
    return this.http.post<any>(this.urlEndPoint + `/boletin/eliminar-pdf`, data, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.boletin as Boletin),
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
