import { Clase } from "./clase";
import { Estado } from "./estado";
import { Parametro } from "./parametro";

export class ContenidoWebCategoria {
    idContenidoWebCategoria!: number;
    nombre!: string;

    orden!: number;
    miniatura!: boolean;
    banner!: boolean;

    fecha!: Date;
    estado!: Estado;
    rcontenidoWebCategoria!:ContenidoWebCategoria|null;




}
