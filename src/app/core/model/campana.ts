

import { Estado } from "./estado";

import { Noticia } from "./noticia";

import { Parametro } from "./parametro";
import { Usuario } from "./usuario";

export class Campana {
    idCampana!: number;
    titulo!: string;
    urlAmigable!: string;
    resumen!: string;
    contenido!: string;
    urlImagen!: string;
    fechaPublicacion!: Date;
    fecha!: Date;
    estado!: Estado;
    usuario!: Usuario;
    pdestacado!: Parametro;
    
    noticias!: Noticia[];







}
