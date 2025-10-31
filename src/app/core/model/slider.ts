import { Estado } from "./estado";
import { Parametro } from "./parametro";


export class Slider {
    idSlider!: number;
    nombre!: string;
    urlRecurso!: string;
    urlImagen1!: string;
    urlImagen2!: string;
    descripcion!:string;
    orden!: number;

    fecha!: Date;

    estado!: Estado;
    pcategoria!: Parametro;



}
