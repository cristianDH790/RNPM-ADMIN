import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { Estado } from '../../core/model/estado';
import { Parametro } from '../../core/model/parametro';


import { EstadoFiltro } from '../../core/filter/estadoFiltro';

import { Validacion } from '../../core/util/validacion';

import { CommonModule } from '@angular/common';
import { NgxLoadingModule } from 'ngx-loading';
import { AuthService } from '../../core/service/auth.service';
import { faArrowLeft, faCheck, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BoletinUploadComponent } from "../upload/boletinUpload.component";

import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND, URL_IMAGE } from '../../config/config';
import { Subscription } from 'rxjs';
import { ModalService } from '../../core/service/modal.service';
import { FileManagerComponent } from '../../general/fileManager/fileManager.component';

import { Boletin } from '../../core/model/boletin';
import { BoletinService } from '../../core/service/boletin.service';
import { EstadoService } from '../../core/service/estado.service';
import { Proyecto } from '../../core/model/proyecto';
import { ProyectoService } from '../../core/service/proyecto.service';
import { ProyectoFiltro } from '../../core/filter/proyectoFiltro';
import { DomSanitizer } from '@angular/platform-browser';
import { BoletinPdfUploadComponent } from '../uploadpdf/boletinPdfUpload.component';

@Component({
  selector: 'app-alianzaEditar',
  templateUrl: './boletinEditar.component.html',
  styleUrls: ['./boletinEditar.component.css'],
  providers: [EstadoService, BoletinService, AuthService, ProyectoService],
  imports: [FontAwesomeModule, RouterLink, CommonModule, FormsModule, AngularEditorModule, FileManagerComponent, NgxLoadingModule, BoletinUploadComponent, BoletinPdfUploadComponent],
  standalone: true
})
export class BoletinEditarComponent {

  /*Font Awesome Iconos*/
  faCheck = faCheck;
  faArrowLeft = faArrowLeft;
  faPencil = faPencil
  faTrash = faTrash
  /*Fin Font awesome */

  active = 1;
  currentJustify = 'start';
  activev = "top";

  urlBackEnd = URL_BACKEND;
  urlImage = URL_IMAGE;
  urlRecurso = URL_IMAGE;
  boletin: Boletin = new Boletin();
  boletinpdf: Boletin = new Boletin();
  estados!: Estado[];
  proyectos!: Proyecto[];
  pcategorias!: Parametro[];


  ventanaSubirImagenes!: NgbModalRef;

  titulo: string = "Nuevo Boletin";
  errores!: Validacion[];
  loading: boolean = false;
  lboletin: boolean = false;
  lestados: boolean = false;
  lproyectos: boolean = false;
  lclientes: boolean = false;
  lpcategorias: boolean = false;
  modalServiceNotificacion!: Subscription;
  ventanaSubirImagen!: NgbModalRef;
  ventanaSubirBoletin!: NgbModalRef;
  closeResult!: string;

  tipoFileManager: string = "";
  ventanaFileManager!: NgbModalRef;


  urlImagen!: string;


  carga1: boolean = false;
  carga2: boolean = false;
  imgSelected = "";

  archivoSeleccionado!: File;
  archivoSeleccionado2!: File;
  imageSrc!: string;
  recursoSrc!: string;

  editorConfigSmall: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '100px',
    maxHeight: '400px',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: 'p',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    //uploadUrl: 'v1/image',
    //upload: (file: File) => { ... }
    //uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
        'fontName'],
      ['fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',

        'insertImage',
      ],
    ]
  };

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '100px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: 'p',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    //uploadUrl: 'v1/image',
    //upload: (file: File) => { ... }
    //uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [],
      ['insertImage',
      ],
    ]
  };

  constructor(
    private router: Router,
    private estadoService: EstadoService,
    private proyectoService: ProyectoService,
    private boletinService: BoletinService,
    private activatedRoute: ActivatedRoute,
    public ngbService: NgbModal,
    public modalService: ModalService,
    private authService: AuthService,
    public sanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = + params.get('id')!;
      localStorage.setItem("rnpm.admin.carpeta", "boletin");//nombre de la carpeta(cpanel/archivos)

      if (id) {

        this.boletinService.getBoletin(id).subscribe((boletin) => {
          this.boletin = boletin;
          this.titulo = "Edición de boletin";
          this.urlImagen = this.urlImage + '/archivos/boletin/' + ((this.boletin.urlImagen != null) ? this.boletin.urlImagen : 'imagen.png') + "?" + Math.random();
          this.urlRecurso = this.urlRecurso + '/archivos/boletinpdf/' + ((this.boletin.urlRecurso != null) ? this.boletin.urlRecurso : 'imagen-gris.png');
        }, err => {
          this.errores = err as Validacion[];
          Swal.fire('Error', `${err.error}`, 'error');
          this.router.navigate(['/boletines/lista']);
        });


      } else {

        this.urlImagen = this.urlImage + '/archivos/boletin/imagen.png';
        this.urlRecurso = this.urlRecurso + '/archivos/boletinpdf/imagen-gris.png';
        // this.urlImagen1 = '';
        this.boletin.nombre = "";
        this.boletin.descripcion = "";
        this.boletin.urlImagen = "";
        this.boletin.urlRecurso = "";

        this.boletin.estado = new Estado();
        this.boletin.estado.idEstado = 410;
        this.boletin.proyecto = new Proyecto();
        this.boletin.proyecto.idProyecto = 0;




      }
      this.lboletin = true;
      this.actualizarCargador();
    });



    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 332, 0, 0))
      .pipe(

    ).subscribe(response => {
      this.estados = response.content as Estado[];
      this.lestados = true;
      this.actualizarCargador();
    });


    this.proyectoService.getProyectos(new ProyectoFiltro('', '', '', '', 0, 0, 0, 0))
      .pipe(

    ).subscribe(response => {
      this.proyectos = response.content as Proyecto[];
      let proyecto = new Proyecto();
      proyecto.idProyecto = 0;
      proyecto.nombre = "Ninguno";
      this.proyectos.push(proyecto);
      this.lproyectos = true;
      this.actualizarCargador();
    });




    this.modalServiceNotificacion = this.modalService.notificarEvento.subscribe(modal => {
      console.log("RETORNO");
      this.loading = true;

      if (modal.origen == "subirImgWeb") {
        this.archivoSeleccionado = modal.retorno;
        this.boletin.urlImagen = modal.retorno.name;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(this.archivoSeleccionado);
        this.loading = false;
        this.ventanaSubirImagen.close();

      } else if (modal.origen == "subirPdfWeb") {
        this.archivoSeleccionado2 = modal.retorno;
        this.boletin.urlRecurso = modal.retorno.name;  // Guarda el nombre del archivo PDF

        // Si quieres mostrar el PDF en iframe, necesitas un URL para mostrarlo.
        // Puedes usar URL.createObjectURL para crear una URL temporal:

        this.recursoSrc = URL.createObjectURL(this.archivoSeleccionado2);

        this.loading = false;
        this.ventanaSubirBoletin.close();

      } else if (modal.origen == "cerrar") {
        this.loading = false;
        this.ventanaSubirImagenes.close();
      } else if (modal.origen == "filemanager") {

        if (modal.retorno.imagen == true) {
          switch (this.tipoFileManager) {
            case 'contenido':
              this.imgSelected = '<img alt="" style="width:' + modal.retorno.ancho + 'px;height:' + modal.retorno.alto + 'px"  src="' + this.urlImage + '/archivos/' + modal.retorno.url + '">';
              this.loading = false
              break;

          }

        }
        this.loading = false;
        this.ventanaFileManager.close();
      }
      window.scroll(0, 0);
    });
  }

  fileManager(content: any, tipoFileManager: string) {
    console.log("iniciando filemanager");
    this.tipoFileManager = tipoFileManager;
    this.ventanaFileManager = this.ngbService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaFileManager' });
    this.ventanaFileManager.result.then((e) => {
      console.log("entro");
      this.closeResult = `Closed with: ${e}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    console.log("Finalizando filemanager");
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


  guardar(): void {
    console.log("Guardar: " + this.boletin.idBoletin);

    if (this.boletin.idBoletin === undefined) {

      console.log(this.boletin)
      this.boletinService.boletinGuardar(this.boletin)
        .subscribe(
          boletin => {
            this.boletin = boletin;
            console.log('boletin: ' + boletin);
            if (this.archivoSeleccionado != null) {
              this.boletinService.boletinUpload(this.archivoSeleccionado, this.boletin.idBoletin).subscribe(boletin => {
                this.urlImagen = this.urlImage + '/archivos/boletin/' + ((boletin.urlImagen != null) ? boletin.urlImagen : 'imagen.png') + "?" + Math.random();
                this.imageSrc = this.urlImage + '/archivos/boletin/' + ((boletin.urlImagen != null) ? boletin.urlImagen : 'imagen.png') + "?" + Math.random();

                this.carga1 = true;
              },
                err => {
                  this.errores = err.error.errors as Validacion[];
                  this.carga1 = true;
                });





            }
            if (this.archivoSeleccionado2 != null) {
              this.boletinService.boletinUploadPdf(this.archivoSeleccionado2, this.boletin.idBoletin).subscribe(boletin => {
                // Si hay urlRecurso, usarla tal cual (ya es URL completa)
                // Si no, usar imagen de fallback con URL completa concatenada manualmente
                this.urlRecurso = boletin.urlRecurso ? boletin.urlRecurso + "?" + Math.random() : this.urlImage + '/archivos/boletinpdf/imagen-gris.png?' + Math.random();
                this.recursoSrc = this.urlRecurso;
                this.carga2 = true;
              }, err => {
                this.errores = err.error.errors as Validacion[];
                this.carga2 = true;
              });
            }

            this.loading = false;
            this.router.navigate(['/boletines/lista/']);
            Swal.fire('Nuevo boletin', `El boletin "${boletin.nombre}" ha sido creado con éxito`, 'success');
          },
          err => {
            console.log(err);
            this.errores = err.error.errors as Validacion[];
          }
        );

    } else {
      console.log("Actualizar");
      console.log(this.boletin);

      this.boletinService.boletinActualizar(this.boletin)
        .subscribe(
          boletin => {
            this.boletin = boletin;
            console.log('boletin: ' + boletin.idBoletin);
            if (this.archivoSeleccionado != null) {
              this.boletinService.boletinUpload(this.archivoSeleccionado, this.boletin.idBoletin).subscribe(boletin => {
                console.log('boletin: ' + boletin);
                this.boletin = boletin;
                this.urlImagen = this.urlImage + '/archivos/boletin/' + ((boletin.urlImagen != null) ? boletin.urlImagen : 'imagen.png') + "?" + Math.random();
                this.imageSrc = this.urlImage + '/archivos/boletin/' + ((boletin.urlImagen != null) ? boletin.urlImagen : 'imagen.png') + "?" + Math.random();
                this.loading = false;
                this.carga1 = true;
              },
                err => {
                  this.errores = err.error.errors as Validacion[];
                  this.carga1 = true;
                });

            }
            if (this.archivoSeleccionado2 != null) {
              console.log("Archivo PDF:", this.archivoSeleccionado2);
              console.log("Archivo PDF antes de subir:", this.archivoSeleccionado2);

              console.log('boletin: ' + this.archivoSeleccionado2);
              this.boletinService.boletinUploadPdf(this.archivoSeleccionado2, this.boletin.idBoletin).subscribe(boletin => {
                this.boletin = boletin;
                this.urlRecurso = boletin.urlRecurso ? boletin.urlRecurso + "?" + Math.random() : this.urlImage + '/archivos/boletinpdf/imagen-gris.png?' + Math.random();
                this.recursoSrc = (boletin.urlRecurso ? boletin.urlRecurso : this.urlImage + '/archivos/boletinpdf/' + 'imagen-gris.png') + "?" + Math.random();
                this.recursoSrc = this.urlRecurso;
                this.loading = false;
                this.carga2 = true;
              }, err => {
                this.errores = err.error.errors as Validacion[];
                this.carga2 = true;
              });

            }

            this.router.navigate(['/boletines/lista']);
            Swal.fire('boletin actualizado', `El boletin "${boletin.nombre}" ha sido actualizado con éxito`, 'success');
          },
          err => {
            this.errores = err.error.errors as Validacion[];

          }
        )
    }
  }

  public convertirAUrl(cadena: string) {
    cadena = cadena.toLowerCase();
    cadena = cadena.replace(/ã/g, "a");
    cadena = cadena.replace(/à/g, "a");
    cadena = cadena.replace(/á/g, "a");
    cadena = cadena.replace(/ä/g, "a");
    cadena = cadena.replace(/â/g, "a");
    cadena = cadena.replace(/è/g, "e");
    cadena = cadena.replace(/é/g, "e");
    cadena = cadena.replace(/ë/g, "e");
    cadena = cadena.replace(/ê/g, "e");
    cadena = cadena.replace(/ì/g, "i");
    cadena = cadena.replace(/í/g, "i");
    cadena = cadena.replace(/ï/g, "i");
    cadena = cadena.replace(/î/g, "i");
    cadena = cadena.replace(/ò/g, "o");
    cadena = cadena.replace(/ó/g, "o");
    cadena = cadena.replace(/ö/g, "o");
    cadena = cadena.replace(/ô/g, "o");
    cadena = cadena.replace(/ù/g, "u");
    cadena = cadena.replace(/ú/g, "u");
    cadena = cadena.replace(/ü/g, "u");
    cadena = cadena.replace(/û/g, "u");
    cadena = cadena.replace(/ñ/g, "n");
    cadena = cadena.replace(/ç/g, "c");
    cadena = cadena.replace(/\s/g, "-");
    cadena = cadena.replace(/\?/g, "");
    cadena = cadena.replace(/\¿/g, "");
    cadena = cadena.replace(/\"/g, "");
    cadena = cadena.replace(/\¡/g, "");
    cadena = cadena.replace(/\!/g, "");
    return cadena;
  };



  //comparadores
  compararEstado(o1: Estado, o2: Estado): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idEstado === o2.idEstado;
  }



  compararParametro(o1: Parametro, o2: Parametro): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idParametro === o2.idParametro;
  }
  // compararProyecto(o1: Proyecto, o2: Proyecto): boolean {
  //   if (o1 === undefined && o2 === undefined)
  //     return true;
  //   return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idProyecto === o2.idProyecto;
  // }

  compararProyecto(o1: any, o2: any): boolean {
    if (o1 === null && o2 === null) return true;
    if (o1 === null || o2 === null) return false;
    return o1.idProyecto === o2.idProyecto;
  }



  actualizarCargador() {
    this.loading = (this.lboletin && this.lestados) ? false : true;
  }
  abrirModalSubirImg(content: any) {
    this.ventanaSubirImagen = this.ngbService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaSubirImagen' })
    this.ventanaSubirImagen.result.then((e) => {
      this.closeResult = `Closed with: ${e}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  abrirModalSubirPdf(content: any) {
    this.ventanaSubirBoletin = this.ngbService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaSubirPdf' })
    this.ventanaSubirBoletin.result.then((e) => {
      this.closeResult = `Closed with: ${e}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  eliminarImagen(boletin: Boletin) {
    this.loading = true;
    this.boletinService.boletinEliminarImagen(boletin)
      .subscribe(
        boletin => {
          this.boletin = boletin;
          this.imageSrc = this.urlImage + '/archivos/boletin/imagen.png';
          this.recursoSrc = this.urlImage + '/archivos/boletin/imagen.png';
          this.loading = false;
        }
      )
  }
  eliminarPdf(boletin: Boletin) {
    this.loading = true;
    this.boletinService.boletinEliminarPdf(boletin)
      .subscribe(
        boletin => {
          this.boletin = boletin;
          this.urlRecurso = this.urlImage + '/archivos/boletinpdf/imagen-gris.png';
          this.recursoSrc = this.urlImage + '/archivos/boletinpdf/imagen-gris.png';
          this.loading = false;
        }
      )
  }
  validarError(campo: string, r: number): string {
    let respuesta = "";

    if (this.errores) {
      this.errores.forEach(e => {
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


}
