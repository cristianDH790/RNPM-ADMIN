import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Perfil } from '../model/perfil';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_BACKEND } from '../../config/config';
import Swal from 'sweetalert2';
import { PerfilFiltro } from '../filter/perfilFiltro';

@Injectable()
export class PerfilService {

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



  // getPerfiles(filtro: PerfilFiltro): Observable<any> {
  //   return this.http.post(this.urlEndPoint + '/perfiles', filtro, { headers: this.agregarAuthozationHeader() })
  //     .pipe(
  //       map((response: any) => {
  //         (response.content as Perfil[]).map(perfil => {
  //           return perfil;
  //         });
  //         return response;
  //       }),
  //       //-- Seguridad - Inicio
  //       catchError(e => {
  //         if (this.isNoAutorizado(e)) {
  //           return throwError(e);
  //         }

  //         if (e.status == 400) {
  //           return throwError(e);
  //         }

  //         console.error(e.error);
  //         return throwError(e);
  //       })
  //       //-- Seguridad - Fin
  //     );
  // }

     // PERFIL
    getPerfil(id:number): Observable<Perfil> {
      return this.http.get<Perfil>(this.urlEndPoint + '/perfil/' + id, { headers: this.agregarAuthozationHeader() }).pipe(
        catchError(e => {

            if(e.status==401){
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

    getPerfiles(filtro: PerfilFiltro): Observable<any> {
      return this.http.post(this.urlEndPoint + '/perfiles', filtro, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => {
            (response.content as Perfil[]).map(perfil => {
              perfil.nombre = perfil.nombre.toUpperCase();

              return perfil;
            });
            return response;
          }),
          //-- Seguridad - Inicio
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

            console.error(e.error);
            return throwError(e);
          })
          //-- Seguridad - Fin
        );
    }

    perfilGuardar(perfil: Perfil): Observable<Perfil> {
      return this.http.post(this.urlEndPoint + "/perfil/guardar", perfil, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.perfil as Perfil),
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

    perfilActualizar(perfil: Perfil): Observable<any> {
      return this.http.put<any>(this.urlEndPoint + `/perfil/guardar/${perfil.idPerfil}`, perfil, { headers: this.agregarAuthozationHeader() })
        .pipe(
          map((response: any) => response.perfil as Perfil),
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
  /*
    perfilEliminar(idPerfil: Number): Observable<Perfil> {
      return this.http.delete<Perfil>(this.urlEndPoint + '/perfil/eliminar/' + idPerfil, { headers: this.agregarAuthozationHeader() }).pipe(
        catchError(err =>  {

          //-- Seguridad - Inicio
          if (this.isNoAutorizado(err)) {
            return throwError(err);
          }
          //-- Seguridad - Fin

        })
      );
    }
  */

}
