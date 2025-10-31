import { Component, OnInit, Input } from '@angular/core';
import { Configuracion } from '../../core/model/configuracion';
import { Modal } from '../../core/model/modal';
import { ModalService } from '../../core/service/modal.service';
import { AuthService } from '../../core/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'configuracion-upload',
  templateUrl: './configuracionUpload.component.html',
  styleUrls: ['./configuracionUpload.component.css'],
  providers: [ AuthService],
  standalone:true

})

export class ConfiguracionUploadComponent implements OnInit {

  @Input() configuracion!: Configuracion;

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
    /*
    if (this.archivoSeleccionado.type.indexOf('image') < 0) {
      Swal.fire(
        "Subir una imagen!",
        `Debe seleccionar un archivo de tipo imagen`,
        'error');
      this.archivoSeleccionado = null;
      this.etiqueta = 'Seleccionar una imagen';
    }*/
  }

  subirArchivo(): void {

    if (this.archivoSeleccionado != null) {

      this.modal = new Modal()
      this.modal.origen = "subirArchivo";
      this.modal.retorno = this.archivoSeleccionado;

      console.log("Archivo: " + this.archivoSeleccionado);

      this.modalService.notificarEvento.emit(this.modal);


    } else {
      Swal.fire(
        "Subir una imagen!",
        `Debe seleccionar un archivo de imagen`,
        'error');
    }

  }
}
