import { Estado } from "./estado";
import { Proyecto } from "./proyecto";


export class Boletin {
    idBoletin!: number;
    estado!: Estado;
    nombre!: string;
    descripcion!: string;
    urlImagen!: string;
    urlRecurso!: string;
    fecha!: Date;

    proyecto!: Proyecto;
}
