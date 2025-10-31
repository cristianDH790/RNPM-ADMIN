import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_BACKEND } from '../../config/config';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Proyecto } from '../model/proyecto';
import { ProyectoFiltro } from '../filter/proyectoFiltro';
import { ProyectoImagen } from '../model/proyectoImagen';
import { ProyectoImagenFiltro } from '../filter/proyectoImagenFiltro';
@Injectable()
export class ProyectoService {

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


  //PROYECTOS

    getProyecto(id: number): Observable<Proyecto> {
      return this.http.get<Proyecto>(this.urlEndPoint + '/proyecto/' + id, { headers: this.agregarAuthozationHeader() }).pipe(
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

    getProyectos(filtro: ProyectoFiltro): Observable<any> {
      return this.http.post(this.urlEndPoint + '/proyectos', filtro, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => {
            (response.content as Proyecto[]).map(proyecto => {
              return proyecto;
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


    proyectoGuardar(proyecto: Proyecto): Observable<Proyecto> {
      return this.http.post(this.urlEndPoint + "/proyecto/guardar", proyecto, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.proyecto as Proyecto),
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

    proyectoUpload(archivo: File, idProyecto: number): Observable<Proyecto> {

      let formData = new FormData();
      formData.append("archivo", archivo);
      formData.append("idProyecto", idProyecto.toString());

      return this.http.post(this.urlEndPoint + "/proyecto/upload", formData, { headers: this.agregarAuthozationHeaderFormData() }).pipe(
        map((response: any) => response.proyecto as Proyecto),
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

    proyectoActualizar(proyecto: Proyecto): Observable<any> {
      return this.http.put<any>(this.urlEndPoint + `/proyecto/guardar/${proyecto.idProyecto}`, proyecto, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.proyecto as Proyecto),
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


    proyectoEliminarImagen(proyecto: Proyecto): Observable<any> {

      let data = { "idProyecto": proyecto.idProyecto };

      return this.http.post<any>(this.urlEndPoint + `/proyecto/eliminar-imagen`, data, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.proyecto as Proyecto),
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

    proyectoEliminar(idProyecto: number): Observable<Proyecto> {
      return this.http.delete<Proyecto>(this.urlEndPoint + '/proyecto/eliminar/' + idProyecto, { headers: this.agregarAuthozationHeader() }).pipe(
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

    //PROYECTO IMAGENES

    getProyectoImagen(id: number): Observable<ProyectoImagen> {
      return this.http.get<ProyectoImagen>(this.urlEndPoint + '/proyectoImagen/' + id, { headers: this.agregarAuthozationHeader() }).pipe(
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

    getProyectosImagenes(filtro: ProyectoImagenFiltro): Observable<any> {
      return this.http.post(this.urlEndPoint + '/proyectosImagenes', filtro, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => {
            (response.content as ProyectoImagen[]).map(proyectoImagen => {
              return proyectoImagen;
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

    proyectoImagenGuardar(proyectoImagen: ProyectoImagen): Observable<ProyectoImagen> {
      return this.http.post(this.urlEndPoint + "/proyectoImagen/guardar", proyectoImagen, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.proyectoImagen as ProyectoImagen),
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

    proyectoImagenActualizar(proyectoImagen: ProyectoImagen): Observable<any> {
      return this.http.put<any>(this.urlEndPoint + `/proyectoImagen/guardar/${proyectoImagen.idProyectoImagen}`, proyectoImagen, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.proyectoImagen as ProyectoImagen),
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

    proyectoImagenEliminar(idProyectoImagen: Number): Observable<ProyectoImagen> {
      return this.http.delete<ProyectoImagen>(this.urlEndPoint + '/proyectoImagen/eliminar/' + idProyectoImagen, { headers: this.agregarAuthozationHeader() }).pipe(
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

    proyectoImagenUpload(archivo: File, idProyectoImagen: number): Observable<ProyectoImagen> {

      let formData = new FormData();
      formData.append("archivo", archivo);
      formData.append("idProyectoImagen", idProyectoImagen.toString());

      return this.http.post(this.urlEndPoint + "/proyectoImagen/upload-imagen", formData,{ headers: this.agregarAuthozationHeaderFormData() }).pipe(
        map((response: any) => response.idProyectoImagen as ProyectoImagen),
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

    proyectoImagenUploadMiniatura(archivo: File, idProyectoImagen: number): Observable<ProyectoImagen> {

      let formData = new FormData();
      formData.append("archivo", archivo);
      formData.append("idProyectoImagen", idProyectoImagen.toString());

      return this.http.post(this.urlEndPoint + "/proyectoImagen/upload-miniatura", formData,{ headers: this.agregarAuthozationHeaderFormData() }).pipe(
        map((response: any) => response.idProyectoImagen as ProyectoImagen),
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

    proyectoImagenEliminarImagen(proyectoImagen: ProyectoImagen,tipo: string): Observable<any> {

      let data = { "idProyectoImagen": proyectoImagen.idProyectoImagen,"tipo":tipo };

      return this.http.post<any>(this.urlEndPoint + `/proyectoImagen/eliminar-imagen`, data, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.proyectoImagen as ProyectoImagen),
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
