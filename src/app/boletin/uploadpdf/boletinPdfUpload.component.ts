import { Component, OnInit, Input } from '@angular/core';
import { Modal } from '../../core/model/modal';
import { ModalService } from '../../core/service/modal.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/service/auth.service';
import { Boletin } from '../../core/model/boletin';
import { BoletinService } from '../../core/service/boletin.service';

@Component({
  selector: 'upload-boletin-pdf',
  templateUrl: './boletinPdfUpload.component.html',
  styleUrls: ['./boletinPdfUpload.component.css'],
  standalone:true,
  providers: [BoletinService, AuthService],
})

export class BoletinPdfUploadComponent implements OnInit {

  @Input() boletinpdf!: Boletin;

  private archivoSeleccionado!: File;

  private modal!:Modal;

  etiqueta!: string;

  loading = false;

  constructor(

    public modalService: ModalService,
    public authService: AuthService) {
  }

 ngOnInit(): void {
  this.etiqueta = 'Seleccionar un archivo PDF';
}


  // seleccionarArchivo(event:any): void {
  //   this.archivoSeleccionado = event.target.files[0];
  //   this.etiqueta = '' + this.archivoSeleccionado.name;

  //   if (this.archivoSeleccionado.type.indexOf('image') < 0) {
  //     Swal.fire(
  //       "Subir una imagen!",
  //       `Debe seleccionar un archivo de tipo imagen`,
  //       'error');
  //     this.archivoSeleccionado = null!;
  //     this.etiqueta = 'Seleccionar una imagen';
  //   }
  // }


  seleccionarArchivo(event: any): void {
  this.archivoSeleccionado = event.target.files[0];
  this.etiqueta = this.archivoSeleccionado.name;

  // Validar que sea PDF
  if (this.archivoSeleccionado.type !== 'application/pdf') {
    Swal.fire(
      "Subir PDF!",
      `Debe seleccionar un archivo en formato PDF`,
      'error'
    );
    this.archivoSeleccionado = null!;
    this.etiqueta = 'Seleccionar un archivo PDF';
  }
}

  subirArchivo(): void {

    if (this.archivoSeleccionado != null) {

      this.modal = new Modal()
      this.modal.origen = "subirPdfWeb";
      this.modal.retorno = this.archivoSeleccionado;

      console.log("Archivo: " + this.archivoSeleccionado);

      this.modalService.notificarEvento.emit(this.modal);


    } else {
      Swal.fire(
        "Subir una documento PDF!",
        `Debe seleccionar un archivo PDF`,
        'error');
    }

  }
}
