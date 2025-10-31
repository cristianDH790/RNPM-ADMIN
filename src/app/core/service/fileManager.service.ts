import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';



import { URL_BACKEND } from '../../config/config';
import { Carpeta } from '../util/carpeta';
import { Archivo } from '../util/archivo';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';


@Injectable()
export class FileManagerService {

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

  private isNoAutorizado(e:any): boolean {
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
      Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.nombres}, no tienes acceso a este recurso!`, 'warning');
      this.router.navigate(['/dashboard/inicio']);
      return true;
    }
    return false;
  }



  // Carpetas


  getCarpetas(nombreCarpeta: string): Observable<any> {
    return this.http.get<any>(this.urlEndPoint + '/carpetas',{ params: {nombreCarpeta: nombreCarpeta},headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {
          (response.carpetas as Carpeta[]).map(carpeta => {


            return carpeta;
          });
          return response;
        }),
        //-- Seguridad - Inicio
        catchError(e => {

          if(e.status==401){
            this.router.navigate(['/authentication/login']);
          }

          //-- Seguridad - Fin

          if (e.status == 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          return throwError(e);
        })
        //-- Seguridad - Fin
      );
  }

  getCarpetasLista(): Observable<any> {
    return this.http.get(this.urlEndPoint + '/carpetas/listar',{ headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {
          (response.carpetas as Carpeta[]).map(carpeta => {


            return carpeta;
          });
          return response;
        }),
        //-- Seguridad - Inicio
        catchError(e => {

          if(e.status==401){
            this.router.navigate(['/authentication/login']);
          }

          //-- Seguridad - Fin

          if (e.status == 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          return throwError(e);
        })
        //-- Seguridad - Fin
      );
  }


  getArchivos(carpeta:Carpeta): Observable<any> {
    console.log(carpeta);


    return this.http.post(this.urlEndPoint + "/archivos", {"ruta":carpeta.ruta},{ headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {
          (response.archivos as Archivo[]).map(archivo => {
            return archivo;
          });
          return response;
        }),
        //-- Seguridad - Inicio
        catchError(e => {
          console.error(e)
          if(e.status==401){
            this.router.navigate(['/authentication/login']);
          }

          //-- Seguridad - Fin

          if (e.status == 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          return throwError(e);
        })
        //-- Seguridad - Fin
      );
  }

  directorioNuevo(data:any): Observable<any> {
    console.log(data);

    return this.http.post(this.urlEndPoint + '/nuevo-directorio',data,{ headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {

          return response;
        }),
        //-- Seguridad - Inicio
        catchError(e => {
          console.error(e)
          if(e.status==401){
            this.router.navigate(['/authentication/login']);
          }

          //-- Seguridad - Fin

          if (e.status == 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          return throwError(e);
        })
        //-- Seguridad - Fin
      );
  }

  archivoUpload(archivo: File,ruta:string): Observable<any> {

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("ruta", ruta);

    return this.http.post(this.urlEndPoint + "/archivoUpload", formData,{ headers: this.agregarAuthozationHeaderFormData() }).pipe(
      map((response: any) => response),
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

  eliminarArchivoCarpeta(carpetaSeleccionada: Carpeta,archivoSeleccionado:Archivo|null): Observable<any> {

    let data={
      "carpeta":carpetaSeleccionada.ruta,
      "archivo":archivoSeleccionado?.nombre
    };
    return this.http.post<any>(this.urlEndPoint + '/eliminarArchivoCarpeta',data, { headers: this.agregarAuthozationHeader() } ).pipe(
      catchError(e => {


        //-- Seguridad - Fin

        if (e.status == 400) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        return throwError(e);
      })
    );
  }

  descargarArchivo(carpetaSeleccionada:Carpeta,archivoSeleccionado:Archivo):Observable<any>{
    let data={
      "carpeta":carpetaSeleccionada.ruta,
      "archivo":archivoSeleccionado?.nombre
    };
    return this.http.post(this.urlEndPoint + '/descargarArchivo',data,{
      responseType: "blob",
      headers: this.agregarAuthozationHeader()

    }

    );
  }

  renombrarArchivo(data:any): Observable<any> {

    return this.http.post(this.urlEndPoint + '/renombrar-archivo',data,{ headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {

          return response;
        }),
        //-- Seguridad - Inicio
        catchError(e => {
          console.error(e)
          if(e.status==401){
            this.router.navigate(['/authentication/login']);
          }

          //-- Seguridad - Fin

          if (e.status == 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          return throwError(e);
        })
        //-- Seguridad - Fin
      );
  }


  copiarArchivo(data:any): Observable<any> {

    return this.http.post(this.urlEndPoint + '/copiar-archivo',data,{ headers: this.agregarAuthozationHeader() })
      .pipe(
        map((response: any) => {

          return response;
        }),
        //-- Seguridad - Inicio
        catchError(e => {
          console.error(e)
          if(e.status==401){
            this.router.navigate(['/authentication/login']);
          }

          //-- Seguridad - Fin

          if (e.status == 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          return throwError(e);
        })
        //-- Seguridad - Fin
      );
  }
}
