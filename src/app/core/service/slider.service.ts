import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_BACKEND } from '../../config/config';
import { Slider } from '../model/slider';
import { catchError, map, Observable, throwError } from 'rxjs';
import { SliderFiltro } from '../filter/sliderFiltro';
@Injectable()
export class SliderService {

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





    // Slider
    getSlider(id: number): Observable<Slider> {
      return this.http.get<Slider>(this.urlEndPoint + '/slider/' + id, { headers: this.agregarAuthozationHeader() }).pipe(
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

    getSliders(filtro: SliderFiltro): Observable<any> {
      return this.http.post(this.urlEndPoint + '/sliders', filtro, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => {
            (response.content as Slider[]).map(slider => {
              slider.nombre = slider.nombre.toUpperCase();

              return slider;
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

    sliderGuardar(slider: Slider): Observable<Slider> {
      return this.http.post(this.urlEndPoint + "/slider/guardar", slider, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.slider as Slider),
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

    sliderActualizar(slider: Slider): Observable<any> {
      return this.http.put<any>(this.urlEndPoint + `/slider/guardar/${slider.idSlider}`, slider, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.slider as Slider),
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

    sliderEliminar(idSlider: number): Observable<Slider> {
      return this.http.delete<Slider>(this.urlEndPoint + '/slider/eliminar/' + idSlider, { headers: this.agregarAuthozationHeader() }).pipe(
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

    sliderUpload(archivo: File, idSlider: number): Observable<Slider> {

      let formData = new FormData();
      formData.append("archivo", archivo);
      formData.append("idSlider", idSlider.toString());

      return this.http.post(this.urlEndPoint + "/slider/upload1", formData, { headers: this.agregarAuthozationHeaderFormData() }).pipe(
        map((response: any) => response.slider as Slider),
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

    sliderUpload2(archivo: File, idSlider: number): Observable<Slider> {

      let formData = new FormData();
      formData.append("archivo", archivo);
      formData.append("idSlider", idSlider.toString());



      return this.http.post(this.urlEndPoint + "/slider/upload2", formData, { headers: this.agregarAuthozationHeaderFormData() }).pipe(
        map((response: any) => response.slider as Slider),
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


    sliderEliminarImagen(slider: Slider, tipo: string): Observable<any> {

      let data = { "idSlider": slider.idSlider, "tipo": tipo };

      return this.http.post<any>(this.urlEndPoint + `/slider/eliminar-imagen`, data, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.slider as Slider),
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
