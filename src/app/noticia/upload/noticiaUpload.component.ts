import { Component, OnInit, Input } from '@angular/core';
import { Modal } from '../../core/model/modal';
import { ModalService } from '../../core/service/modal.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/service/auth.service';
import { Noticia } from '../../core/model/noticia';
import { NoticiaService } from '../../core/service/noticia.service';

@Component({
  selector: 'upload-noticia',
  templateUrl: './noticiaUpload.component.html',
  styleUrls: ['./noticiaUpload.component.css'],
  standalone:true,
  providers: [NoticiaService, AuthService],
})

export class NoticiaUploadComponent implements OnInit {

  @Input() noticia!: Noticia;

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
