import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Usuario } from '../model/usuario';

import { URL_BACKEND } from '../../config/config';
import { Perfil } from '../model/perfil';

@Injectable()
export class AuthService {

  private _usuario!: Usuario;
  private _token!: string;

  constructor(private http: HttpClient) {


  }

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')!) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token')!;
      return this._token;
    }
    return "";
  }

  login(usuario: Usuario): Observable<any> {

    const urlEndPoint = URL_BACKEND + '/login';
    let params = new URLSearchParams();

    let parametros = {
      'login': usuario.login,
      'password': usuario.password
    }

    //return this.http.post<any>(urlEndPoint, params.toString());
    return this.http.post(urlEndPoint, parametros)
  }

  guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.idUsuario = payload.usuario.idUsuario;
    this._usuario.nombres = payload.usuario.nombres;
    this._usuario.pApellido = payload.usuario.pApellido;
    this._usuario.sApellido = payload.usuario.sApellido;
    this._usuario.perfil = new Perfil();
    this._usuario.perfil.idPerfil = payload.usuario.idPerfil;
    this._usuario.perfil = payload.usuario.perfil;
    this._usuario.perfil.abr = payload.usuario.cddPerfil;
    this._usuario.login = payload.usuario.login;

    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken) {
      const decodedPayload = atob(accessToken.split(".")[1]);
      const jsonPayload = decodeURIComponent(escape(decodedPayload));
      return JSON.parse(jsonPayload);
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);
    if (payload != null && payload.usuario.nombres && payload.usuario.nombres.length > 0) {
      return true;
    }
    return false;
  }

  hasRole(role: string): boolean {
    if (this.usuario.perfil.nombre == role) {
      return true;
    }
    return false;
  }

  logout(): void {
    this._token = "";
    this._usuario = new Usuario();
    sessionStorage.clear();
    //sessionStorage.removeItem('token');
    //sessionStorage.removeItem('usuario');
  }

}
