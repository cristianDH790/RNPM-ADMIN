export class ProyectoFiltro {

    ordenCriterio: string;
    ordenTipo: string;
    parametro: string;
    valor: string;
    idEstado: number;
    idPcategoria: number;
    pagina: number;
    registros: number;

    constructor(ordenCriterio: string, ordenTipo: string, parametro: string, valor: string,
      idEstado: number,idPcategoria: number, pagina: number, registros: number) {
        this.ordenCriterio = ordenCriterio;
        this.ordenTipo = ordenTipo;
        this.parametro = parametro;
        this.valor = valor;
        this.idEstado = idEstado;
        this.idPcategoria = idPcategoria;
        this.pagina = pagina;
        this.registros = registros;
    }

}
