import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_BACKEND } from '../../config/config';
import { NoticiaFiltro } from '../filter/noticiaFiltro';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Noticia } from '../model/noticia';
@Injectable()
export class NoticiaService {

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

   // Noticia
    getNoticia(id: number): Observable<Noticia> {
      return this.http.get<Noticia>(this.urlEndPoint + '/noticia/' + id, { headers: this.agregarAuthozationHeader() }).pipe(
        catchError(e => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          console.error(e.error);
          return throwError(e);
        })
      );
    }

    getNoticias(noticiaFiltro: NoticiaFiltro): Observable<any> {
      return this.http.post(this.urlEndPoint + '/noticias', noticiaFiltro, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => {
            (response.content as Noticia[]).map(noticia => {
              noticia.titulo = noticia.titulo.toUpperCase();

              return noticia;
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

    noticiaGuardar(noticia: Noticia): Observable<Noticia> {
      return this.http.post(this.urlEndPoint + "/noticia/guardar", noticia, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.noticia as Noticia),
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

    noticiaActualizar(noticia: Noticia): Observable<any> {
      return this.http.put<any>(this.urlEndPoint + `/noticia/guardar/${noticia.idNoticia}`, noticia, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.noticia as Noticia),
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

    noticiaEliminar(idNoticia: Number): Observable<Noticia> {
      return this.http.delete<Noticia>(this.urlEndPoint + '/noticia/eliminar/' + idNoticia, { headers: this.agregarAuthozationHeader() }).pipe(
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

    noticiaUpload(archivo: File, idNoticia: number): Observable<Noticia> {

      let formData = new FormData();
      formData.append("archivo", archivo);
      formData.append("idNoticia", idNoticia.toString());

      return this.http.post(this.urlEndPoint + "/noticia/upload", formData, { headers: this.agregarAuthozationHeaderFormData() }).pipe(
        map((response: any) => response.noticia as Noticia),
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


    noticiaEliminarImagen(noticia: Noticia): Observable<any> {
      let data = { "idNoticia": noticia.idNoticia };
      return this.http.post<any>(this.urlEndPoint + `/noticia/eliminar-imagen`, data, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.noticia as Noticia),
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
