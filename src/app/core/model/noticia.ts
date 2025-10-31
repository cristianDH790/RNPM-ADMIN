import { Estado } from "./estado";
import { NoticiaCategoria } from "./noticiaCategoria";
import { Parametro } from "./parametro";
import { Proyecto } from "./proyecto";
import { Usuario } from "./usuario";

export class Noticia {
    idNoticia!: number;
    estado!: Estado;
    pcategoria!: Parametro;
    ptipo!: Parametro;
    usuario!: Usuario;
    titulo!: string;
    resumen!: string;
    contenido!: string;
    urlImagen!: string;
    urlAmigable!: string;
    orden!: number;
    tituloSeo!: string;
    palabrasClaveSeo!: string;
    descripcionSeo!: string;
    fechaPublicacion!: Date;
    fecha!: Date;


    proyecto!: Proyecto;
}
