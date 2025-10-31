export class NoticiaFiltro {

    ordenCriterio: string;
    ordenTipo: string;
    parametro: string;
    valor: string;
    idEstado: number;
    idUsuario: number;
    idPdestacado: number;
    idPtipo: number;
    pagina: number;
    registros: number;

    constructor(ordenCriterio: string, ordenTipo: string, parametro: string, valor: string, idEstado: number,
      idUsuario: number, idPdestacado: number,idPtipo: number, pagina: number, registros: number) {
        this.ordenCriterio = ordenCriterio;
        this.ordenTipo = ordenTipo;
        this.parametro = parametro;
        this.valor = valor;
        this.idEstado = idEstado;
        this.idUsuario = idUsuario;
        this.idPdestacado = idPdestacado;
        this.idPtipo = idPtipo;
        this.pagina = pagina;
        this.registros = registros;
    }

}
