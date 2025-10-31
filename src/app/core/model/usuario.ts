import { Estado } from "./estado";
import { Parametro } from "./parametro";
import { Perfil } from "./perfil";


export class Usuario {

  idUsuario!: number;
  documento!: string;
  nombres!: string;
  pApellido!: string;
  sApellido!: string;
  fechaNacimiento!: Date;
  sexo!: string;
  correo!: string;
  telefono!: string;
  login!: string;
  password!: string;
  fecha!: Date;
  estado!: Estado;
  perfil!: Perfil;
  pdocumento!: Parametro;

  pedidosTotal!: number;

}

