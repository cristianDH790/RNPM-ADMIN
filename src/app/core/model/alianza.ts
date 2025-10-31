import { Estado } from "./estado";
import { NoticiaCategoria } from "./noticiaCategoria";
import { Parametro } from "./parametro";
import { Usuario } from "./usuario";

export class Alianza {
    idAlianza!: number;
    estado!: Estado;
    nombre!: string;
    descripcion!: string;
    urlImagen!: string;
    orden!: number;
    fecha!: Date;
}
