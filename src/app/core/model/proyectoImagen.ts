import { Estado } from "./estado";
import { Proyecto } from "./proyecto";

export class ProyectoImagen {
    idProyectoImagen!: number;
    proyecto!: Proyecto;
    estado!: Estado;
    titulo!: string;
    urlImagen!: string;
    urlMiniatura!: string;
    orden!: number;
    fecha!: Date;

}
