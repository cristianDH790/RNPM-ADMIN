import { Clase } from "./clase";
import { Estado } from "./estado";

export class Categoria {
    idCategoria!: number;
    nombre!: string;
    urlAmigable! : string;
    urlImagen!:string;
    orden!: number;

    fecha!: Date;
    estado!: Estado;
    productos!:string;
    rcategoria!:Categoria|null;




}
