export class ClaseFiltro {

    ordenCriterio: string;
    ordenTipo: string;
    parametro: string;
    valor: string;
    idClase: number;

    pagina: number;
    registros: number;

    constructor(ordenCriterio:string, ordenTipo:string, parametro:string, valor:string, idClase:number, pagina: number, registros: number) {
        this.ordenCriterio = ordenCriterio;
        this.ordenTipo = ordenTipo;
        this.parametro = parametro;
        this.valor = valor;
        this.idClase = idClase;

        this.pagina = pagina;
        this.registros = registros;
    }

  }
