export class ConfiguracionFiltro {

    ordenCriterio: string;
    ordenTipo: string;
    parametro: string;
    valor: string;
    idPtipo: number;
    pagina: number;
    registros: number;

    constructor(ordenCriterio: string, ordenTipo: string, parametro: string, valor: string, idPtipo:number, pagina: number, registros: number) {
        this.ordenCriterio = ordenCriterio;
        this.ordenTipo = ordenTipo;
        this.parametro = parametro;
        this.valor = valor;
        this.idPtipo = idPtipo;
        this.pagina = pagina;
        this.registros = registros;
    }

}