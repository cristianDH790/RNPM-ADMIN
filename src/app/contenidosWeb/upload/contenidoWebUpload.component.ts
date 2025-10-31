import { Component, OnInit, Input } from '@angular/core';

import { ContenidoWeb } from '../../core/model/contenidoWeb';
import { Modal } from '../../core/model/modal';



import { ModalService } from '../../core/service/modal.service';
import { AuthService } from '../../core/service/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'upload-contenidoWeb',
  templateUrl: './contenidoWebUpload.component.html',
  styleUrls: ['./contenidoWebUpload.component.css'],
  providers: [ AuthService],
  standalone:true
})

export class ContenidoWebUploadComponent implements OnInit {

  @Input() contenidoWeb!: ContenidoWeb;

  private archivoSeleccionado!: File;

  private modal!:Modal;

  etiqueta!: string;

  loading = false;

  constructor(

    public modalService: ModalService,
    public authService: AuthService) {
  }

  ngOnInit(): void {
    this.etiqueta = 'Seleccionar una imagen';

   }

  seleccionarArchivo(event:any): void {
    this.archivoSeleccionado = event.target.files[0];
    this.etiqueta = '' + this.archivoSeleccionado.name;

    if (this.archivoSeleccionado.type.indexOf('image') < 0) {
      Swal.fire(
        "Subir una imagen!",
        `Debe seleccionar un archivo de tipo imagen`,
        'error');
      this.archivoSeleccionado = null!;
      this.etiqueta = 'Seleccionar una imagen';
    }
  }

  subirArchivo(): void {

    if (this.archivoSeleccionado != null) {

      this.modal = new Modal()
      this.modal.origen = "subirImg";
      this.modal.archivo = this.archivoSeleccionado;
      this.modal.retorno = this.contenidoWeb;

      console.log("Archivo: " + this.archivoSeleccionado);
      console.log("subirImg");

      this.modalService.notificarEvento.emit(this.modal);


    } else {
      Swal.fire(
        "Subir una imagen!",
        `Debe seleccionar un archivo de imagen`,
        'error');
    }

  }
}
