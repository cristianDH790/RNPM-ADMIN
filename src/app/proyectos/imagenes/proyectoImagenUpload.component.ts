import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Modal } from '../../core/model/modal';


import { ModalService } from '../../core/service/modal.service';
import { AuthService } from '../../core/service/auth.service';

import Swal from 'sweetalert2';

import { tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { ReadVarExpr } from '@angular/compiler';
import { ProyectoImagen } from '../../core/model/proyectoImagen';
import { Validacion } from '../../core/util/validacion';
import { Estado } from '../../core/model/estado';
import { Parametro } from '../../core/model/parametro';
import { URL_BACKEND, URL_IMAGE } from '../../config/config';

import { EstadoFiltro } from '../../core/filter/estadoFiltro';
import { NgxLoadingModule } from 'ngx-loading';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Proyecto } from '../../core/model/proyecto';
import { ProyectoService } from '../../core/service/proyecto.service';
import { EstadoService } from '../../core/service/estado.service';


@Component({
  selector: 'upload-proyectoImagen',
  templateUrl: './proyectoImagenUpload.component.html',
  styleUrls: ['./proyectoImagenUpload.component.css'],
  providers: [ AuthService,EstadoService,ProyectoService],
  imports: [NgxLoadingModule, NgClass, NgbModule, CommonModule, FormsModule],
  standalone: true
})

export class ProyectoImagenUploadComponent implements OnInit {

  @Input() proyectoImagen!: ProyectoImagen;
  @Input() erroresProyectoImagen!: Validacion[];
  estados!: Estado[];
  ptipos!: Parametro[];

  private archivoSeleccionado!: File;
  private archivoSeleccionado2!: File;
  public previsualizacion!: string;
  private modal!: Modal;

  etiqueta!: string;
  etiqueta2!: string;

  titulo: string = "Nueva imagen asociada al producto";
  urlImagen: string = "";
  errores!: string[];
  loading: boolean = true;
  lproductoImagen: boolean = false;
  lestados: boolean = false;
  urlBackEnd: string = URL_BACKEND;
  urlImage: string = URL_IMAGE;
  imageSrc: string = "";
  imageSrc2: string = "";
  constructor(
    private router: Router,
    public modalService: ModalService,
    public authService: AuthService,
    public proyectoService: ProyectoService,

    private estadoService: EstadoService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {

    this.etiqueta = 'Seleccionar una imagen';
    this.proyectoImagen = new ProyectoImagen();
    this.proyectoImagen.estado = new Estado();
    this.proyectoImagen.estado.idEstado = 308;
    this.lproductoImagen = true;

    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 311, 0, 0))
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.estados = response.content as Estado[];
        this.lestados = true;
        this.actualizarCargador();
      });
  }

  seleccionarArchivo(event: any, tipo: string): void {

    if (tipo == "imagen") {
      this.archivoSeleccionado = event.target.files[0];
      if (this.archivoSeleccionado.type.indexOf('image') < 0) {
        Swal.fire(
          "Subir una imagen!",
          `Debe seleccionar un archivo de tipo imagen`,
          'error');
        this.archivoSeleccionado = null!;
        this.etiqueta = 'Seleccionar una imagen';
      } else {
        if (event.target.files && event.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imageSrc = e.target.result;
            this.etiqueta = '' + this.archivoSeleccionado.name;
            this.proyectoImagen.urlImagen = this.etiqueta;
          };
          reader.readAsDataURL(event.target.files[0]);
        }

      }
    } else {
      this.archivoSeleccionado2 = event.target.files[0];
      if (this.archivoSeleccionado2.type.indexOf('image') < 0) {
        Swal.fire(
          "Subir una imagen!",
          `Debe seleccionar un archivo de tipo imagen`,
          'error');
        this.archivoSeleccionado = null!;
        this.etiqueta = 'Seleccionar una imagen';
      } else {
        if (event.target.files && event.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imageSrc2 = e.target.result;
            this.etiqueta2 = '' + this.archivoSeleccionado2.name;
          };
          reader.readAsDataURL(event.target.files[0]);
        }

      }
    }

  }

  subirArchivo(): void {
    console.log("pi: " + this.proyectoImagen.idProyectoImagen);

    if (this.proyectoImagen.idProyectoImagen == null) {
      if (this.archivoSeleccionado == null) {

        Swal.fire(
          "Subir una imagen!",
          `Debe seleccionar un archivo de imagen`,
          'error');
      } else {
        //para nuevo
        this.proyectoImagen.idProyectoImagen = 0;
        this.modal = new Modal()
        this.modal.origen = "subirImagenes";
        this.modal.archivo = this.archivoSeleccionado;
        this.modal.archivo2 = this.archivoSeleccionado2;
        console.log("pi: " + this.proyectoImagen.titulo);

        this.modal.retorno = this.proyectoImagen
        console.log("retorno: " + this.modal.retorno.titulo);
        console.log("Archivo: " + this.modal.archivo);

        this.modalService.notificarEvento.emit(this.modal);
      }
    } else {

      this.modal = new Modal()
      this.modal.origen = "subirImagenes";
      this.modal.archivo = this.archivoSeleccionado;
      this.modal.archivo2 = this.archivoSeleccionado2;

      console.log("pi: " + this.proyectoImagen.titulo);

      this.modal.retorno = this.proyectoImagen
      console.log("retorno: " + this.modal.retorno.nombre);
      console.log("Archivo: " + this.archivoSeleccionado);

      this.modalService.notificarEvento.emit(this.modal);
    }
  }

  eliminarImagen(proyectoImagen: ProyectoImagen, tipo: string) {
    this.loading = true;
    console.log("proyectoImagen");
    console.log(proyectoImagen);
    if (proyectoImagen.idProyectoImagen) {

      this.proyectoService.proyectoImagenEliminarImagen(proyectoImagen, tipo)
        .subscribe(
          proyectoImagen => {
            console.log("proyectoImage2n");
            console.log(proyectoImagen);
            this.proyectoImagen = proyectoImagen;
            if (tipo == 'urlImagen') {
              this.imageSrc = this.urlImage + '/archivos/proyectoImagen/imagen.png';
            } else if (tipo == 'urlMiniatura') {

              this.imageSrc2 = this.urlImage + '/archivos/proyectoImagen/imagen.png';
            }

          }
        )
    } else {
      if (tipo == 'urlImagen') {

        this.imageSrc = this.urlImage + '/archivos/proyectoImagen/imagen.png';
        this.proyectoImagen.urlImagen = "";
      } else if (tipo == 'urlMiniatura') {
        this.imageSrc2 = this.urlImage + '/archivos/proyectoImagen/imagen.png';
        this.proyectoImagen.urlMiniatura = "";

      }

    }

    this.loading = false;
  }



  cerrar() {
    this.modal = new Modal()
    this.modal.origen = "cerrar";
    this.modal.retorno = null;
    this.modalService.notificarEvento.emit(this.modal);
  }



  //comparadores
  compararEstado(o1: Estado, o2: Estado): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idEstado === o2.idEstado;
  }


  validarError(campo: string, r: number): string {
    let respuesta = "";

    if (this.erroresProyectoImagen) {
      this.erroresProyectoImagen.forEach(e => {
        if (e.campo == campo) {
          if (r == 1)
            respuesta = "error";
          else
            respuesta = "(" + e.valor + ")";
        }
      });
    }
    return respuesta;
  }

  actualizarCargador() {
    this.loading = (this.lproductoImagen && this.lestados) ? false : true;
  }
}
