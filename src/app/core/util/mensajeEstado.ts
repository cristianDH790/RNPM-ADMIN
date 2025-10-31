export class MensajeEstado {

    referencia: string;
    mensaje: string;
    estado: number;

    constructor(referencia:string, mensaje:string, estado: number) {
        this.referencia = referencia;
        this.mensaje = mensaje;
        this.estado = estado;
      }
}
