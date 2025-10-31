export class PersonalFiltro {

    ordenCriterio: string;
    ordenTipo: string;
    parametro: string;
    valor: string;
    idEstado: number;
    idPtipo: number;
    idPdestacado: number;
    pagina: number;
    registros: number;

    constructor(ordenCriterio: string, ordenTipo: string, parametro: string, valor: string, idEstado: number,
      idPtipo: number, idPdestacado: number, pagina: number, registros: number) {
        this.ordenCriterio = ordenCriterio;
        this.ordenTipo = ordenTipo;
        this.parametro = parametro;
        this.valor = valor;
        this.idEstado = idEstado;
        this.idPtipo = idPtipo;
        this.idPdestacado = idPdestacado;
        this.pagina = pagina;
        this.registros = registros;
    }

}
