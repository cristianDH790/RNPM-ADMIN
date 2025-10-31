import { Estado } from "./estado";

import { Parametro } from "./parametro";

export class Proyecto {
    idProyecto!: number;
    estado!: Estado;
    //cliente!: Cliente;
    destacado!:number;
    idpcategoria!: Parametro;
    nombre!: string;
    descripcion!: string;
    contenido!: string;
    urlAmigable!: string;
    urlImagen!: string;
    orden!: number;
    palabrasClaveSeo!: string;
    tituloSeo!: string;
    descripcionSeo!: string;
    fechaProyecto!: Date;
    fecha!: Date;

}
