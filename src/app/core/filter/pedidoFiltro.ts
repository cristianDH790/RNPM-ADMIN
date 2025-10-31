export class PedidoFiltro {

    ordenCriterio: string;
    ordenTipo: string;
    parametro: string;
    valor: string;
    idEstado: number;
    idUsuario: number;
    idFormaPago: number;
    idEntrega: number;
    idpPago: number;
    fechaRango:string;
    pagina: number;
    registros: number;

    constructor(ordenCriterio: string, ordenTipo: string, parametro: string, valor: string, idEstado: number, idUsuario:number,
        idFormaPago:number, idEntrega:number,idpPago:number,fechaRango:string, pagina: number, registros: number) {
        this.ordenCriterio = ordenCriterio;
        this.ordenTipo = ordenTipo;
        this.parametro = parametro;
        this.valor = valor;
        this.idEstado = idEstado;
        this.idUsuario = idUsuario;
        this.idFormaPago = idFormaPago;
        this.idEntrega = idEntrega;
        this.idpPago = idpPago;
        this.fechaRango = fechaRango;
        this.pagina = pagina;
        this.registros = registros;
    }

}
