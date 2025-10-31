export class TipoFiltro {

    ordenCriterio: string;
    ordenTipo: string;
    parametro: string;
    valor: string;
    idClase: number;
    idEstado: number;

    pagina: number;
    registros: number;

    constructor(ordenCriterio:string, ordenTipo:string, parametro:string, valor:string, idEstado:number, idClase:number, pagina: number, registros: number) {
        this.ordenCriterio = ordenCriterio;
        this.ordenTipo = ordenTipo;
        this.parametro = parametro;
        this.valor = valor;
        this.idEstado = idEstado;
        this.idClase = idClase;

        this.pagina = pagina;
        this.registros = registros;
    }

  }
