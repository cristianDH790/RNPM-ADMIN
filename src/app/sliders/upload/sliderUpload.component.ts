import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Slider } from '../../core/model/slider';
import { Modal } from '../../core/model/modal';



import { ModalService } from '../../core/service/modal.service';

import Swal from 'sweetalert2';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'upload-slider',
  templateUrl: './sliderUpload.component.html',
  styleUrls: ['./sliderUpload.component.css'],
  standalone:true,
  providers: [ AuthService],
})

export class SliderUploadComponent implements OnInit {

  @Input() slider!: Slider;

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
