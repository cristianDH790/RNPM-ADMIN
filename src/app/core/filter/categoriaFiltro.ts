export class CategoriaFiltro {

    ordenCriterio: string;
    ordenTipo: string;
    parametro: string;
    valor: string;
    idEstado: number;
    idRcategoria: number;
    pagina: number;
    registros: number;

    constructor(ordenCriterio: string, ordenTipo: string, parametro: string, valor: string, idEstado: number, idRcategoria: number, pagina: number, registros: number) {
        this.ordenCriterio = ordenCriterio;
        this.ordenTipo = ordenTipo;
        this.parametro = parametro;
        this.valor = valor;
        this.idEstado = idEstado;
        this.idRcategoria = idRcategoria;
        this.pagina = pagina;
        this.registros = registros;
    }

}
