import { Clase } from "./clase";

export class Estado {
    idEstado!: number;
    nombre!: string;
    abr!: string;
    descripcion!: string;
    orden!: number;
    fecha!: Date;
    clase!: Clase;
}
