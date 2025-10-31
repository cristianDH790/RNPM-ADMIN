
export class Registro {
    
    id: number;
    orden: number;
    referencia: string;
    estado: string;
    
    constructor(id:number, orden:number, referencia:string, estado:string) {
      this.id = id;
      this.orden = orden;
      this.referencia = referencia;
      this.estado = estado;
    }

}
