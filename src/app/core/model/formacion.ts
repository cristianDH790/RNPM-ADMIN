import { Estado } from "./estado";

import { Parametro } from "./parametro";

export class Formacion {
    idFormacion!: number;
    estado!: Estado;
    idpDestacado!:Parametro;
    idpTipo!: Parametro;
    nombre!: string;
    descripcion!: string;
    contenido!: string;
    urlAmigable!: string;
    urlImagen!: string;
    orden!: number;
    palabrasClaveSeo!: string;
    tituloSeo!: string;
    descripcionSeo!: string;
    fechaFormacion!: Date;
    fecha!: Date;
}
