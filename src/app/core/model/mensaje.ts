import { Clase } from "./clase";
import { Estado } from "./estado";

export class Mensaje {
    idMensaje!: number;
    nombre!: string;
    asunto!: string;
    contenido!: string;
    observacion!: string;
    fecha!: Date;
    estado!: Estado;
    clase!: Clase;




}
