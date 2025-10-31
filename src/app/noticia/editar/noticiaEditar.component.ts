import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from '../../core/model/usuario';
import { Estado } from '../../core/model/estado';
import { Parametro } from '../../core/model/parametro';


import { EstadoFiltro } from '../../core/filter/estadoFiltro';
import { ParametroFiltro } from '../../core/filter/parametroFiltro';

import { Validacion } from '../../core/util/validacion';

import { CommonModule } from '@angular/common';
import { NgxLoadingModule } from 'ngx-loading';
import { AuthService } from '../../core/service/auth.service';
import { faArrowLeft, faCheck, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NoticiaUploadComponent } from "../upload/noticiaUpload.component";
import { Noticia } from '../../core/model/noticia';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND, URL_IMAGE } from '../../config/config';
import { Subscription } from 'rxjs';
import { ModalService } from '../../core/service/modal.service';
import { FileManagerComponent } from '../../general/fileManager/fileManager.component';
import { NoticiaService } from '../../core/service/noticia.service';
import { EstadoService } from '../../core/service/estado.service';
import { ParametroService } from '../../core/service/parametro.service';
import { Proyecto } from '../../core/model/proyecto';
import { ProyectoFiltro } from '../../core/filter/proyectoFiltro';
import { ProyectoService } from '../../core/service/proyecto.service';

@Component({
  selector: 'app-noticiaEditar',
  templateUrl: './noticiaEditar.component.html',
  styleUrls: ['./noticiaEditar.component.css'],
  providers: [ParametroService, EstadoService, NoticiaService, AuthService, ProyectoService],
  imports: [FontAwesomeModule, RouterLink, CommonModule, FormsModule, AngularEditorModule, FileManagerComponent, NgxLoadingModule, NoticiaUploadComponent],
  standalone: true
})
export class NoticiaEditarComponent {

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
  noticia: Noticia = new Noticia();
  estados!: Estado[];
  ptipos!: Parametro[];
  proyectos!: Proyecto[];

  ventanaSubirImagenes!: NgbModalRef;

  titulo: string = "Nueva noticia";
  errores!: Validacion[];
  loading: boolean = false;
  lnoticia: boolean = false;
  lestados: boolean = false;
  lproyectos: boolean = false;
  lclientes: boolean = false;
  lpcategorias: boolean = false;
  modalServiceNotificacion!: Subscription;
  ventanaSubirImagen!: NgbModalRef;
  closeResult!: string;

  tipoFileManager: string = "";
  ventanaFileManager!: NgbModalRef;


  urlImagen1!: string;

  carga1: boolean = false;
  imgSelected = "";

  archivoSeleccionado!: File;
  imageSrc!: string;

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
    private parametroService: ParametroService,

    private noticiaService: NoticiaService,
    private activatedRoute: ActivatedRoute,
    public ngbService: NgbModal,
    public modalService: ModalService,
    private authService: AuthService,
  ) {

  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = + params.get('id')!;
      localStorage.setItem("rnpm.admin.carpeta", "noticia");//nombre de la carpeta(cpanel/archivos)

      if (id) {

        this.noticiaService.getNoticia(id).subscribe((noticia) => {
          this.noticia = noticia;
          this.noticia.estado = noticia.estado;
          this.titulo = "Edición de noticia";
          this.urlImagen1 = this.urlImage + '/archivos/noticia/' + ((this.noticia.urlImagen != null) ? this.noticia.urlImagen : 'imagen.png') + "?" + Math.random();

        }, err => {
          this.errores = err as Validacion[];
          Swal.fire('Error', `${err.error}`, 'error');
          this.router.navigate(['/noticias/lista']);
        });


      } else {

        this.urlImagen1 = this.urlImage + '/archivos/noticia/imagen.png';
        // this.urlImagen1 = '';
        this.noticia.titulo = "";
        this.noticia.resumen = "";
        this.noticia.urlAmigable = "";
        this.noticia.urlImagen = "";
        this.noticia.orden = 1;
        this.noticia.palabrasClaveSeo = "";
        this.noticia.tituloSeo = "";
        this.noticia.descripcionSeo = "";
        this.noticia.estado = new Estado();
        this.noticia.estado.idEstado = 333;
        this.noticia.ptipo = new Parametro();
        this.noticia.ptipo.idParametro = 0;
        this.noticia.usuario = new Usuario();
        this.noticia.usuario.idUsuario = this.authService.usuario.idUsuario;
        this.noticia.proyecto = new Proyecto();
        this.noticia.proyecto.idProyecto = 0;

      }
      this.lnoticia = true;
      this.actualizarCargador();
    });



    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 319, 0, 0))
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
    this.parametroService.getParametros(new ParametroFiltro('', '', '', '', 104, 314, 0, 0))
      .pipe(

    ).subscribe(response => {
      this.ptipos = response.content as Parametro[];
      let parametro = new Parametro();
      parametro.idParametro = 0;
      parametro.nombre = "Seleccione";
      this.ptipos.push(parametro);
      this.lpcategorias = true;
      this.actualizarCargador();
    });


    this.modalServiceNotificacion = this.modalService.notificarEvento.subscribe(modal => {
      console.log("RETORNO");
      this.loading = true;

      if (modal.origen == "subirImgWeb") {
        this.archivoSeleccionado = modal.retorno;
        this.noticia.urlImagen = modal.retorno.name;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(this.archivoSeleccionado);
        this.loading = false;
        this.ventanaSubirImagen.close();

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
    console.log("Guardar: " + this.noticia.idNoticia);

    if (this.noticia.idNoticia === undefined) {

      console.log(this.noticia)
      this.noticiaService.noticiaGuardar(this.noticia)
        .subscribe(
          noticia => {
            this.noticia = noticia;
            console.log('noticia: ' + noticia);
            if (this.archivoSeleccionado != null) {
              this.noticiaService.noticiaUpload(this.archivoSeleccionado, this.noticia.idNoticia).subscribe(noticia => {
                this.urlImagen1 = this.urlImage + '/archivos/noticia/' + ((noticia.urlImagen != null) ? noticia.urlImagen : 'imagen.png') + "?" + Math.random();
                this.imageSrc = this.urlImage + '/archivos/noticia/' + ((noticia.urlImagen != null) ? noticia.urlImagen : 'imagen.png') + "?" + Math.random();
                this.carga1 = true;
              },
                err => {
                  this.errores = err.error.errors as Validacion[];
                  this.carga1 = true;
                });

            }

            this.loading = false;
            this.router.navigate(['/noticias/lista/']);
            Swal.fire('Nueva noticia', `La noticia "${noticia.titulo}" ha sido creado con éxito`, 'success');
          },
          err => {
            console.log(err);
            this.errores = err.error.errors as Validacion[];
          }
        );

    } else {
      console.log("Actualizar");
      console.log(this.noticia);

      this.noticiaService.noticiaActualizar(this.noticia)
        .subscribe(
          noticia => {
            this.noticia = noticia;
            console.log('noticia: ' + noticia.idNoticia);
            if (this.archivoSeleccionado != null) {
              this.noticiaService.noticiaUpload(this.archivoSeleccionado, this.noticia.idNoticia).subscribe(noticia => {
                console.log('noticia: ' + noticia);
                this.noticia = noticia;
                this.urlImagen1 = this.urlImage + '/archivos/noticia/' + ((noticia.urlImagen != null) ? noticia.urlImagen : 'imagen.png') + "?" + Math.random();
                this.imageSrc = this.urlImage + '/archivos/noticia/' + ((noticia.urlImagen != null) ? noticia.urlImagen : 'imagen.png') + "?" + Math.random();
                this.loading = false;
                this.carga1 = true;
              },
                err => {
                  this.errores = err.error.errors as Validacion[];
                  this.carga1 = true;
                });

            }

            this.router.navigate(['/noticias/lista']);
            Swal.fire('Noticia actualizado', `La noticia "${noticia.titulo}" ha sido actualizado con éxito`, 'success');
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

    cadena = cadena.replace(/\./g, "");
    cadena = cadena.replace(/\,/g, "");
    cadena = cadena.replace(/\:/g, "");
    cadena = cadena.replace(/\;/g, "");
    return cadena;
  };


  keyup(event: any) {
    this.noticia.urlAmigable = this.convertirAUrl(this.noticia.titulo);

  }

  //comparadores
  compararEstado(o1: Estado, o2: Estado): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idEstado === o2.idEstado;
  }



  compararProyecto(o1: any, o2: any): boolean {
    if (o1 === null && o2 === null) return true;
    if (o1 === null || o2 === null) return false;
    return o1.idProyecto === o2.idProyecto;
  }

  compararParametro(o1: Parametro, o2: Parametro): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idParametro === o2.idParametro;
  }

  actualizarCargador() {
    this.loading = (this.lnoticia && this.lestados && this.lpcategorias) ? false : true;
  }
  abrirModalSubirImg(content: any) {
    this.ventanaSubirImagen = this.ngbService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaSubirImagen' })
    this.ventanaSubirImagen.result.then((e) => {
      this.closeResult = `Closed with: ${e}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  eliminarImagen(noticia: Noticia) {
    this.loading = true;
    this.noticiaService.noticiaEliminarImagen(noticia)
      .subscribe(
        noticia => {
          this.noticia = noticia;
          this.imageSrc = this.urlImage + '/archivos/noticia/imagen.png';
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
