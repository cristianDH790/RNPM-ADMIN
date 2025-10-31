import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FileManagerService } from '../../core/service/fileManager.service';
import { URL_IMAGE } from '../../config/config';
import { Modal } from '../../core/model/modal';
import { Carpeta } from '../../core/util/carpeta';
import { Archivo } from '../../core/util/archivo';
import { ModalService } from '../../core/service/modal.service';
import { saveAs } from "file-saver";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxLoadingModule } from 'ngx-loading';
import { faCheck, faCopy, faDownload, faEdit, faFolder, faFolderOpen, faMinus, faPlus, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'file-manager',
  templateUrl: './fileManager.component.html',
  styleUrls: ['./fileManager.component.css'],
  providers: [FileManagerService],
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, FontAwesomeModule, RouterModule, CommonModule, FormsModule, ReactiveFormsModule, AngularEditorModule, NgxLoadingModule],

})
export class FileManagerComponent implements OnInit {

  faUpload = faUpload;
  faFolder = faFolder;
  faDownload = faDownload;
  faEdit = faEdit;
  faCopy = faCopy;
  faTrash = faTrash;
  faCheck = faCheck;
  faFolderOpen = faFolderOpen
  faPlus = faPlus;
  faMinus = faMinus


  url_imagen = URL_IMAGE;
  private modal!: Modal;
  loading: boolean = true;
  loading2: boolean = true;

  lcarpetas: boolean = false;
  larchivos: boolean = false;

  //Ventanas modales
  @ViewChild('modalNueva') modalNueva: any;
  @ViewChild('modalSeleccion') modalSeleccion: any;
  @ViewChild('modalUpload') modalupload: any;
  @ViewChild('modalRenombrar') modalRenombrar: any;
  @ViewChild('modalCopiar') modalCopiar: any;

  ventanaNueva!: NgbModalRef;
  ventanaSeleccion!: NgbModalRef;
  ventanaUpload!: NgbModalRef;
  ventanaRenombrar!: NgbModalRef;
  ventanaCopiar!: NgbModalRef;

  //Extensiones de archivos
  extImage = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'tiff', 'bmp', 'ai', 'cmp', 'avif', 'heif', 'webp', 'jpg'];
  extPowerPoint = ['pptx', 'ppt', 'ppsx', 'odp', 'pps'];
  extPdf = ['pdf'];
  extExcel = ['xlsx', 'xls', 'csv', 'xlsm', 'xlsb', 'pps', 'xltx', 'xltm', 'xlt'];
  extWord = ['doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'xltm', 'html'];
  extAudio = ['mp3', 'wav', 'ogg', 'webm', 'aac'];
  extVideo = ['mp4', 'webm', 'mov', 'wmv', 'avi', 'flv', 'mkv'];
  extZip = ['zip', 'gzip', 'bzip2', 'tar', 'rar', '7z'];

  //Para Seleccionar archivo
  esImage: boolean = false;
  ancho: string = "auto";
  alto: string = "auto";

  //Para Upload
  urlArchivo = "";
  archivoUploadSeleccionado!: File

  //Para Eliminar
  desabilitaEliminar: boolean = false;

  //Para renombrar
  nombreArchivo: string = "";

  //Para copiar
  carpetasCopiar: Carpeta[];
  carpetaCopiaSeleccionada: Carpeta;
  carpetaStorage!: string;

  closeResult!: string;

  carpetas: Carpeta[];
  carpetaSeleccionada: Carpeta;
  archivoSeleccionado!: Archivo;
  archivos: Archivo[];
  directorio: string;

  ruta: string = "";

  constructor(public modalService: ModalService,
    private fileManagerService: FileManagerService,
    public ngbService: NgbModal) {
    this.carpetaStorage = localStorage.getItem("rnpm.admin.carpeta")!;

    console.log("inicializa carpeta")
    this.carpetas = new Array() as Array<Carpeta>;
    this.archivos = new Array() as Array<Archivo>;
    this.directorio = "";
    console.log("inicializa carpeta copia")
    this.carpetasCopiar = new Array() as Array<Carpeta>;

    console.log("inicializa carpeta con parametros")
    this.carpetaSeleccionada = new Carpeta;
    this.carpetaSeleccionada.padre = this.carpetaStorage;
    this.carpetaSeleccionada.nivel = 1;
    this.carpetaSeleccionada.nombre = this.carpetaStorage;
    this.carpetaSeleccionada.ruta = this.carpetaStorage;
    this.carpetaSeleccionada.subCarpeta = false;

    console.log("inicializa carpeta copia con parametros")
    this.carpetaCopiaSeleccionada = new Carpeta;
    this.carpetaCopiaSeleccionada.padre = this.carpetaStorage;
    this.carpetaCopiaSeleccionada.nivel = 1;
    this.carpetaCopiaSeleccionada.nombre = this.carpetaStorage;
    this.carpetaCopiaSeleccionada.ruta = this.carpetaStorage;
    this.carpetaCopiaSeleccionada.subCarpeta = false;


    this.fileManagerService.getCarpetas(this.carpetaCopiaSeleccionada.nombre).subscribe(response => {
      console.log("buscar carpeta (getCarpeta)")

      this.carpetas = response.carpetas as Carpeta[];
      this.carpetasCopiar = response.carpetas as Carpeta[];

      this.lcarpetas = true;
      this.actualizarCargador();
    });


    console.log("buscar archivos")

    this.fileManagerService.getArchivos(this.carpetaSeleccionada).subscribe(response => {
      if (response && response.archivos) {
        this.archivos = response.archivos as Archivo[];
      }

      this.larchivos = true;
      this.actualizarCargador();
    });


  }

  raiz(nombreCarpeta: string) {
    this.loading = true;
    this.archivos = new Array() as Array<Archivo>

    this.carpetaSeleccionada = new Carpeta;
    this.carpetaSeleccionada.padre = "";
    this.carpetaSeleccionada.nivel = 1;
    this.carpetaSeleccionada.nombre = nombreCarpeta;
    this.carpetaSeleccionada.ruta = nombreCarpeta;
    this.carpetaSeleccionada.subCarpeta = false;

    this.fileManagerService.getCarpetas(this.carpetaSeleccionada.ruta).subscribe(response => {
      this.carpetas = response.carpetas as Carpeta[];
      this.lcarpetas = true;
      this.actualizarCargador();
    });


    this.fileManagerService.getArchivos(this.carpetaSeleccionada).subscribe(response => {
      if (response && response.archivos) {
        this.archivos = response.archivos as Archivo[];
        console.log(this.archivos);
      }
      this.larchivos = true;
      this.actualizarCargador();

    });

  }

  raizCopia(nombreCarpeta: string) {

    this.archivos = new Array() as Array<Archivo>
    this.loading = true;
    this.carpetaCopiaSeleccionada = new Carpeta;
    this.carpetaCopiaSeleccionada.padre = "";
    this.carpetaCopiaSeleccionada.nivel = 1;
    this.carpetaCopiaSeleccionada.nombre = nombreCarpeta;
    this.carpetaCopiaSeleccionada.ruta = nombreCarpeta;
    this.carpetaCopiaSeleccionada.subCarpeta = false;
    this.loading = false;
  }

  verCarpetas(carpeta: Carpeta, nombreCarpeta: string) {
    this.loading = true;
    this.archivos = new Array() as Array<Archivo>
    this.desabilitaEliminar = true;
    this.archivoSeleccionado = null!;
    this.carpetaSeleccionada = carpeta;
    this.fileManagerService.getCarpetas(this.carpetaStorage).subscribe(response => {
      this.carpetas = response.carpetas as Carpeta[];
      this.lcarpetas = true;
      this.actualizarCargador();
    });

    this.fileManagerService.getArchivos(carpeta).subscribe(response => {
      if (response && response.archivos) {
        this.archivos = response.archivos as Archivo[];
        console.log(this.archivos);
        this.larchivos = true;
        this.actualizarCargador();
      }
    });


  }

  verCarpetasCopiar(carpeta: Carpeta, nombreCarpeta: string) {
    this.loading = true;

    this.carpetaCopiaSeleccionada = carpeta;

    this.fileManagerService.getCarpetas(nombreCarpeta).subscribe(response => {
      this.carpetasCopiar = response.carpetas as Carpeta[];

    });
    this.loading = false;

  }
  mostrarImagen(archivo: Archivo) {
    this.loading = true;
    let url;
    switch (this.compararExtension(archivo.extension)) {
      case 'imagen':
        url = URL_IMAGE + "/archivos/" + this.carpetaSeleccionada.ruta + "/" + archivo.nombre;
        break;
      case 'powerPoint':
        url = URL_IMAGE + "/public/template/images/file/file-powerpoint-solid.svg";
        break;
      case 'pdf':
        url = URL_IMAGE + "/public/template/images/file/file-pdf-solid.svg";
        break;
      case 'excel':
        url = URL_IMAGE + "/public/template/images/file/file-excel-solid.svg";
        break;
      case 'word':
        url = URL_IMAGE + "/public/template/images/file/file-word-solid.svg";
        break;
      case 'audio':
        url = URL_IMAGE + "/public/template/images/file/file-audio-solid.svg";
        break;
      case 'video':
        url = URL_IMAGE + "/public/template/images/file/file-video-solid.svg";
        break;
      case 'compress':
        url = URL_IMAGE + "/public/template/images/file/file-archive-solid.svg";
        break;
      case 'archivo':
        url = URL_IMAGE + "/public/template/images/file/file-alt-solid.svg";
        break;
      default:
        url = URL_IMAGE + "/public/template/images/file/file-alt-solid.svg";
        break;
    }
    this.loading = false;
    return url;

  }

  mostrarOcultar(carpeta: Carpeta) {

    if (carpeta.nivel == 2) {
      return "mostrar nivel" + carpeta.nivel;
    } else {

      if (carpeta.nombre == this.carpetaSeleccionada.nombre) {
        return "mostrar nivel" + carpeta.nivel;
      } else {
        return "mostrar nivel" + carpeta.nivel;
      }

    }

  }

  nuevoDirectorio() {
    this.loading2 = false;
    this.ventanaNueva = this.ngbService.open(this.modalNueva, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaNueva' })
    this.ventanaNueva.result.then((e) => {
      this.closeResult = `Closed with: ${e}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  uploadArchivo() {
    this.loading2 = false;
    this.ventanaUpload = this.ngbService.open(this.modalupload, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaUpload' })
    this.ventanaUpload.result.then((e) => {
      this.closeResult = `Closed with: ${e}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  renombrarArchivo() {
    this.loading2 = false;
    this.ventanaRenombrar = this.ngbService.open(this.modalRenombrar, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaRenombrar' })
    this.ventanaRenombrar.result.then((e) => {
      this.closeResult = `Closed with: ${e}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  copiarArchivo(nombreCarpeta: string) {
    this.loading2 = false;
    this.carpetaCopiaSeleccionada = this.carpetaSeleccionada;
    console.log("nombreCarpeta")
    console.log(nombreCarpeta)
    this.fileManagerService.getCarpetas(nombreCarpeta).subscribe(response => {
      this.carpetasCopiar = response.carpetas as Carpeta[];
      console.log("this.carpetasCopiar");
      console.log(this.carpetasCopiar);

    });

    this.ventanaCopiar = this.ngbService.open(this.modalCopiar, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaCopiar' })
    this.ventanaCopiar.result.then((e) => {
      this.closeResult = `Closed with: ${e}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  seleccionar() {

    this.ruta = this.url_imagen + '/archivos/' + this.carpetaSeleccionada.ruta + '/' + this.archivoSeleccionado.nombre;

    this.ventanaSeleccion = this.ngbService.open(this.modalSeleccion, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaSeleccion' })
    this.ventanaSeleccion.result.then((e) => {
      this.closeResult = `Closed with: ${e}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  crearDirectorio(nombreCarpeta: string) {
    this.loading2 = true;
    if (this.directorio == "") {
      Swal.fire(
        "Crear directorio!",
        `Debe ingresar un nombre para el directorio`,
        'error');
      this.loading2 = false;
    } else {

      let data = {
        "directorio": this.directorio,
        "ruta": this.carpetaSeleccionada.ruta
      }

      this.fileManagerService.directorioNuevo(data).subscribe(response => {

        console.log("response");
        console.log(response);

        this.fileManagerService.getCarpetas(nombreCarpeta).subscribe(response => {
          this.carpetas = response.carpetas as Carpeta[];
          console.log("this.carpetas");
          console.log(nombreCarpeta);
          console.log(this.carpetas);
          this.loading = false;
        });
        this.loading2 = false;
        this.ventanaNueva.close();

      });
    }

  }

  clickEvent(archivo: Archivo) {
    this.loading = true;
    this.archivoSeleccionado = archivo;
    this.nombreArchivo = archivo.nombre;
    this.desabilitaEliminar = true;
    if (this.extImage.indexOf(archivo.extension) >= 0) {
      this.esImage = true;
    } else {
      this.esImage = false;
    }
    this.loading = false;

  }

  copiarTexto() {

    var aux = document.createElement("input");
    aux.setAttribute("value", this.ruta);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);

  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
  }

  enviar() {
    this.loading = true;
    this.modal = new Modal()
    this.modal.origen = "filemanager";
    this.modal.retorno = {
      "ancho": this.ancho,
      "alto": this.alto,
      "url": ((this.carpetaSeleccionada.ruta == "") ? this.carpetaSeleccionada.ruta : this.carpetaSeleccionada.ruta + "/") + this.archivoSeleccionado.nombre,
      "imagen": ((this.extImage.indexOf(this.archivoSeleccionado.extension) >= 0) ? true : false)
    };
    console.log("emitiendo modal");
    this.ventanaSeleccion.close();
    this.modalService.notificarEvento.emit(this.modal);
    this.loading = false;
  }

  seleccionarArchivo(event: any): void {
    this.loading = true;
    this.archivoUploadSeleccionado = event.target.files[0];
    let nombre = this.archivoUploadSeleccionado.name;
    let extension = nombre.split('.').pop();
    console.log(extension);
    if (extension) {
      if (this.compararExtension(extension!) == "compress" || this.compararExtension(extension!) == "archivo") {
        Swal.fire(
          "Subir archivo!",
          `El archivo no tiene un formato valido`,
          'error');
        this.archivoUploadSeleccionado = null!;
        this.urlArchivo = "";
      }
    } else {
      if (this.compararExtension(extension!) == "compress" || this.compararExtension(extension!) == "archivo") {
        Swal.fire(
          "Subir archivo!",
          `El archivo no tiene un formato valido`,
          'error');
        this.archivoUploadSeleccionado = null!;

      }
    }
    this.loading = false;

  }

  subirArchivo(nombreCarpeta: string) {
    this.loading2 = true;
    if (this.urlArchivo == "") {
      Swal.fire(
        "Subir archivo!",
        `No ha seleccionado ningun archivo`,
        'error');
      this.loading2 = false;
    } else {

      this.fileManagerService.archivoUpload(this.archivoUploadSeleccionado, this.carpetaSeleccionada.ruta).subscribe(response => {

        this.fileManagerService.getCarpetas(nombreCarpeta).subscribe(response => {
          this.carpetas = response.carpetas as Carpeta[];
          console.log(this.carpetas);

        });
        this.fileManagerService.getArchivos(this.carpetaSeleccionada).subscribe(response => {
          console.log("response");
          console.log(response);
          if (response && response.archivos) {
            this.archivos = response.archivos as Archivo[];
            console.log(this.archivos);

            Swal.fire(
              "Subir archivo!",
              `Archivo subido con exito`,
              'success');

          }

          this.loading2 = false;
        });

        this.ventanaUpload.close();

      });
    }

  }


  compararExtension(extension: string) {
    if (this.extImage.indexOf(extension) >= 0) {
      return "imagen";
    } else if (this.extPowerPoint.indexOf(extension) >= 0) {
      return "powerPoint";
    } else if (this.extPdf.indexOf(extension) >= 0) {
      return "pdf";
    } else if (this.extExcel.indexOf(extension) >= 0) {
      return "excel";
    } else if (this.extWord.indexOf(extension) >= 0) {
      return "word";
    } else if (this.extAudio.indexOf(extension) >= 0) {
      return "audio";
    } else if (this.extVideo.indexOf(extension) >= 0) {
      return "video";
    } else if (this.extZip.indexOf(extension) >= 0) {
      return "compress";
    } else {
      return "archivo";
    }

  }

  validaDisabled() {

    if (this.carpetaSeleccionada) {
      return "disabled";
    } else if (this.archivoSeleccionado) {
      return "disabled";
    } else {
      return "";
    }


  }

  eliminar(nombreCarpeta: string) {
    this.loading2 = true;
    if (this.carpetaSeleccionada) {
      if (this.archivoSeleccionado) {

        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        })
        Swal.fire({
          title: 'Eliminar!',
          text: `Se eliminara el archivo ${this.archivoSeleccionado.nombre}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminar!',
          cancelButtonText: 'No, cancelar!',
          reverseButtons: true
        }).then((result) => {
          if (result.value) {
            this.fileManagerService.eliminarArchivoCarpeta(this.carpetaSeleccionada, this.archivoSeleccionado).subscribe(
              () => {
                this.archivos = this.archivos.filter(cat => cat !== this.archivoSeleccionado)
                Swal.fire(
                  'Eliminar!',
                  `El archivo "${this.archivoSeleccionado.nombre}" se eliminó con éxito.`,
                  'success'
                )
                this.loading2 = false;
              }
            )
          }

        });
      } else {

        Swal.fire(
          "Eliminar!",
          `Se eliminara la carpeta ${this.carpetaSeleccionada.ruta} `,
          'warning');
        Swal.fire({
          title: 'Eliminar!',
          text: `Se eliminara la carpeta ${this.carpetaSeleccionada.ruta}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminar!',
          cancelButtonText: 'No, cancelar!',
          reverseButtons: true
        }).then((result) => {
          if (result.value) {
            this.fileManagerService.eliminarArchivoCarpeta(this.carpetaSeleccionada, null).subscribe(
              () => {
                this.carpetas = this.carpetas.filter(cat => cat !== this.carpetaSeleccionada)
                Swal.fire(
                  'Eliminar!',
                  `La carpeta "${this.carpetaSeleccionada.ruta}" se eliminó con éxito.`,
                  'success'
                )
                this.fileManagerService.getCarpetas(nombreCarpeta).subscribe(response => {
                  this.carpetas = response.carpetas as Carpeta[];
                  console.log(this.carpetas);
                  this.loading2 = false;
                });

              }
            )
          }
        });

      }
    } else {
      this.loading2 = false;
    }

  }

  descargar() {

    this.loading2 = true;
    this.fileManagerService.descargarArchivo(this.carpetaSeleccionada, this.archivoSeleccionado).subscribe(response => {
      saveAs(response, this.archivoSeleccionado.nombre);
      Swal.fire(
        'Descargar archivo',
        `Archivo descargado con éxito.`,
        'success'
      );
      this.loading2 = false;
    }, err => {
      Swal.fire(
        'Descargar archivo',
        `El archivo no se pudo descargar.`,
        'warning'
      );
      this.loading2 = false;
      console.error(err);
    });

  }

  renombrar() {
    this.loading2 = true;
    if (this.nombreArchivo == "") {
      Swal.fire(
        "Renombrar archivo!",
        `Ingrese el nombre nuevo del archivo`,
        'error');
    } else {
      let data = {
        "nombreNuevo": this.nombreArchivo,
        "nombreAnterior": this.archivoSeleccionado.nombre,
        "ruta": this.carpetaSeleccionada.ruta

      }

      this.fileManagerService.renombrarArchivo(data).subscribe(response => {
        console.log("response");
        console.log(response);

        this.fileManagerService.getArchivos(this.carpetaSeleccionada).subscribe(response => {
          console.log("response");
          console.log(response);
          if (response && response.archivos) {
            this.archivos = response.archivos as Archivo[];
            console.log(this.archivos);

            Swal.fire(
              "Renombrar archivo!",
              `Nombre de archivo modificado con exito`,
              'success');

          }
          this.loading2 = false;

        });

        this.ventanaRenombrar.close();

      });
    }

  }

  copiar(nombreCarpeta: string) {
    this.loading2 = true;
    if (this.nombreArchivo == "") {
      Swal.fire(
        "Copiar archivo!",
        `Ingrese el nombre nuevo del archivo`,
        'error');
    } else {
      let data = {
        "nombreNuevo": this.nombreArchivo,
        "carpetaNueva": this.carpetaCopiaSeleccionada.ruta,
        "nombreAnterior": this.archivoSeleccionado.nombre,
        "carpetaAnterior": this.carpetaSeleccionada.ruta

      }
      console.log("data")
      console.log(data)

      this.fileManagerService.copiarArchivo(data).subscribe(response => {

        this.carpetaSeleccionada = this.carpetaCopiaSeleccionada;

        this.fileManagerService.getCarpetas(nombreCarpeta).subscribe(response => {
          this.carpetas = response.carpetas as Carpeta[];
          console.log(this.carpetas);
        });
        this.fileManagerService.getArchivos(this.carpetaCopiaSeleccionada).subscribe(response => {
          console.log("response");
          console.log(response);
          if (response && response.archivos) {
            this.archivos = response.archivos as Archivo[];
            console.log(this.archivos);

            Swal.fire(
              "Copiar archivo!",
              `Archivo copiado con exito`,
              'success');
            this.loading2 = false;
          }
          this.loading2 = false;

        });

        this.ventanaCopiar.close();

      });
    }

  }

  cancelar() {

  }


  actualizarCargador() {
    this.loading = (this.lcarpetas && this.larchivos) ? false : true;
  }

}
