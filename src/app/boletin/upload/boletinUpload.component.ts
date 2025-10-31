import { Component, OnInit, Input } from '@angular/core';
import { Modal } from '../../core/model/modal';
import { ModalService } from '../../core/service/modal.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/service/auth.service';
import { Boletin } from '../../core/model/boletin';
import { BoletinService } from '../../core/service/boletin.service';

@Component({
  selector: 'upload-boletin',
  templateUrl: './boletinUpload.component.html',
  styleUrls: ['./boletinUpload.component.css'],
  standalone:true,
  providers: [BoletinService, AuthService],
})

export class BoletinUploadComponent implements OnInit {

  @Input() boletin!: Boletin;

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
      this.modal.origen = "subirImgWeb";
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
