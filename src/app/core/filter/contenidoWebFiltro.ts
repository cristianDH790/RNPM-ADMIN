export class ContenidoWebFiltro {

    ordenCriterio: string;
    ordenTipo: string;
    parametro: string;
    valor: string;
    idEstado: number;
    idContenidoWebCategoria: number;
    idPtipo: number;
    pagina: number;
    registros: number;

    constructor(ordenCriterio: string, ordenTipo: string, parametro: string, valor: string, idEstado: number, idContenidoWebCategoria:number, idPtipo:number, pagina: number, registros: number) {
        this.ordenCriterio = ordenCriterio;
        this.ordenTipo = ordenTipo;
        this.parametro = parametro;
        this.valor = valor;
        this.idEstado = idEstado;
        this.idContenidoWebCategoria = idContenidoWebCategoria;
        this.idPtipo = idPtipo;
        this.pagina = pagina;
        this.registros = registros;
    }

}
