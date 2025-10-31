import { Tipo } from "./tipo";
import { Estado } from "./estado";

export class Parametro {
    idParametro!: number;
    nombre!: string;
    abr!: string;
    descripcion!: string;
    orden!: number;
    fecha!: Date;
    estado!: Estado;
    tipo!: Tipo;



}
