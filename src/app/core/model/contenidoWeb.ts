import { ContenidoWebCategoria } from "./contenidoWebCategoria";
import { Estado } from "./estado";
import { Parametro } from "./parametro";

export class ContenidoWeb {
  idContenidoWeb!: number;
  nombre!: string;
  urlAmigable!: string;
  resumen!: string;
  contenido!: string;
  urlImagen!: string;
  urlBanner!: string;
  orden!: number;
  tituloSeo!: string;
  descripcionSeo!: string;
  palabrasClaveSeo!: string;
  fecha!: Date;
  estado!: Estado;
  ptipo!: Parametro | null;
  contenidoWebCategoria!: ContenidoWebCategoria | null;


}
