import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_BACKEND } from '../../config/config';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ContenidoWebCategoria } from '../model/contenidoWebCategoria';
import { ContenidoWebCategoriaFiltro } from '../filter/contenidoWebCategoriaFiltro';
import { ContenidoWeb } from '../model/contenidoWeb';
import { ContenidoWebCategoriaOrdenado } from '../model/contenidoWebCategoriaOrdenado';

@Injectable()
export class ContenidoWebCategoriaService {

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

// Contenido Web Categoria
  getContenidoWebCategoria(id: number): Observable<ContenidoWebCategoria> {
    return this.http.get<ContenidoWebCategoria>(this.urlEndPoint + '/contenidoWebCategoria/' + id, { headers: this.agregarAuthozationHeader() }).pipe(
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

  getContenidoWebCategorias(filtro: ContenidoWebCategoriaFiltro): Observable<any> {
    return this.http.post(this.urlEndPoint + '/contenidoWebCategorias', filtro, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {
          (response.content as ContenidoWebCategoria[]).map(contenidoWebCategoria => {
            return contenidoWebCategoria;
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

  contenidoWebCategoriaGuardar(contenidoWebCategoria: ContenidoWebCategoria): Observable<ContenidoWebCategoria> {
    return this.http.post(this.urlEndPoint + "/contenidoWebCategoria/guardar", contenidoWebCategoria, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.contenidoWebCategoria as ContenidoWebCategoria),
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

  contenidoWebCategoriaActualizar(contenidoWebCategoria: ContenidoWebCategoria): Observable<any> {
    return this.http.put<any>(this.urlEndPoint + `/contenidoWebCategoria/guardar/${contenidoWebCategoria.idContenidoWebCategoria}`, contenidoWebCategoria, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.contenidoWebCategoria as ContenidoWebCategoria),
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

  contenidoWebCategoriaEliminar(idContenidoWebCategoria: Number): Observable<ContenidoWebCategoria> {
    return this.http.delete<ContenidoWebCategoria>(this.urlEndPoint + '/contenidoWebCategoria/eliminar/' + idContenidoWebCategoria, { headers: this.agregarAuthozationHeader() }).pipe(
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

  contenidoWebUpload(archivo: File, idContenidoWeb: number, tipo: string): Observable<ContenidoWeb> {

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("idContenidoWeb", idContenidoWeb.toString());
    formData.append("tipo", tipo);



    return this.http.post(this.urlEndPoint + "/contenidoWeb/upload", formData, { headers: this.agregarAuthozationHeaderFormData() }).pipe(
      map((response: any) => response.contenidoWeb as ContenidoWeb),
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


  getContenidoWebCategoriasOrdenado(): Observable<any> {
    return this.http.post(this.urlEndPoint + '/contenidoWebCategoriasOrdenado', "", { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {
          (response as ContenidoWebCategoriaOrdenado[]).map(contenidoWebCategoriaOrdenado => {


            return contenidoWebCategoriaOrdenado;
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



  contenidoWebEliminarImagen(contenidoWeb: ContenidoWeb, tipo: string): Observable<any> {
    let data = { "idContenidoWeb": contenidoWeb.idContenidoWeb, "tipo": tipo };
    return this.http.post<any>(this.urlEndPoint + `/contenidoWeb/eliminar-imagen`, data, { headers: this.agregarAuthozationHeader() })
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


  contenidoWebCategoriaEliminarImagen(contenidoWebCategoria: ContenidoWebCategoria): Observable<any> {
    let data = { "idContenidoWebCategoria": contenidoWebCategoria.idContenidoWebCategoria };
    return this.http.post<any>(this.urlEndPoint + `/contenidoWebCategoria/eliminar-imagen`, data, { headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => response.contenidoWebCategoria as ContenidoWebCategoria),
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


  contenidoWebCategoriaUpload(archivo: File, idContenidoWebCategoria: number): Observable<ContenidoWebCategoria> {
    let formData = new FormData();
    formData.append("idContenidoWebCategoria", idContenidoWebCategoria.toString());
    formData.append("archivo", archivo);
    return this.http.post(this.urlEndPoint + "/contenidoWebCategoria/upload", formData, { headers: this.agregarAuthozationHeaderFormData() }).pipe(
      map((response: any) => response.contenidoWebCategoria as ContenidoWebCategoria),
      catchError(e => {
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



}
