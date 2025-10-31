export class UsuarioFiltro {

  ordenCriterio: string;
  ordenTipo: string;
  parametro: string;
  valor: string;
  idEstado: number;
  idPerfil: number;
  idUbigeo: number;
  pagina: number;
  registros: number;

  constructor(ordenCriterio:string, ordenTipo:string, parametro:string, valor:string,idEstado:number,  idPerfil:number,  idUbigeo:number,  pagina: number, registros: number) {
    this.ordenCriterio = ordenCriterio;
    this.ordenTipo = ordenTipo;
    this.parametro = parametro;
    this.valor = valor;
    this.idEstado = idEstado;
    this.idPerfil = idPerfil;
    this.idUbigeo = idUbigeo;
    this.pagina = pagina;
    this.registros = registros;
  }

  }
