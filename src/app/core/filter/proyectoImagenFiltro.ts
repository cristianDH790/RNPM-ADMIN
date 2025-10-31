export class ProyectoImagenFiltro {

    ordenCriterio: string;
    ordenTipo: string;
    parametro: string;
    valor: string;
    idEstado: number;
    idProyecto: number;
    pagina: number;
    registros: number;

    constructor(ordenCriterio: string, ordenTipo: string, parametro: string, valor: string,
      idEstado: number,idProyecto: number, pagina: number, registros: number) {
        this.ordenCriterio = ordenCriterio;
        this.ordenTipo = ordenTipo;
        this.parametro = parametro;
        this.valor = valor;
        this.idEstado = idEstado;
        this.idProyecto = idProyecto;
        this.pagina = pagina;
        this.registros = registros;
    }

}
