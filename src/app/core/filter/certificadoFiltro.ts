export class CertificadoFiltro {

    ordenCriterio: string;
    ordenTipo: string;
    parametro: string;
    valor: string;
    idEstado: number;
    idAlumno: number;
    idCurso: number;
    pagina: number;
    registros: number;

    constructor(ordenCriterio: string, ordenTipo: string, parametro: string, valor: string,
      idEstado: number, idAlumno: number,idCurso: number, pagina: number, registros: number) {
        this.ordenCriterio = ordenCriterio;
        this.ordenTipo = ordenTipo;
        this.parametro = parametro;
        this.valor = valor;
        this.idEstado = idEstado;
        this.idAlumno = idAlumno;
        this.idCurso = idCurso;
        this.pagina = pagina;
        this.registros = registros;
    }

}
