import { Estado } from "./estado";
import { Clase } from "./clase";

export class Tipo {
    idTipo!: number;

    nombre!: string;
    abr!: string;
    descripcion!: string;
    orden!: number;
    fecha!:Date;

    clase!: Clase;
    estado!: Estado;
}
