import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../core/service/auth.service';

import { URL_BACKEND, URL_IMAGE } from '../../config/config';
import { ContenidoWeb } from '../../core/model/contenidoWeb';
import { Estado } from '../../core/model/estado';
import { Parametro } from '../../core/model/parametro';
import { ContenidoWebCategoriaOrdenado } from '../../core/model/contenidoWebCategoriaOrdenado';
import { Validacion } from '../../core/util/validacion';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { ModalService } from '../../core/service/modal.service';
import { ContenidoWebCategoria } from '../../core/model/contenidoWebCategoria';
import { EstadoFiltro } from '../../core/filter/estadoFiltro';
import { ParametroFiltro } from '../../core/filter/parametroFiltro';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContenidoWebUploadComponent } from '../upload/contenidoWebUpload.component';
import { FileManagerComponent } from '../../general/fileManager/fileManager.component';
import { ContenidoWebCategoriaFiltro } from '../../core/filter/contenidoWebCategoriaFiltro';
import { ContenidoWebFiltro } from '../../core/filter/contenidoWebFiltro';
import { faArrowLeft, faCheck, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ContenidoWebCategoriaService } from '../../core/service/contenidoWebCategorias.service';
import { ContenidoWebService } from '../../core/service/contenidoWeb.service';
import { EstadoService } from '../../core/service/estado.service';
import { ParametroService } from '../../core/service/parametro.service';


@Component({
  selector: 'app-contenidoWebEditar',
  styleUrls: ['./contenidoWebEditar.component.css'],
  templateUrl: './contenidoWebEditar.component.html',
  providers: [ParametroService,EstadoService, AuthService, ContenidoWebService,ContenidoWebCategoriaService],
  imports: [FontAwesomeModule, NgxLoadingModule, FormsModule, AngularEditorModule, CommonModule, RouterLink, ContenidoWebUploadComponent, FileManagerComponent],
  standalone: true
})
export class ContenidoWebEditarComponent {

  /*Font awesome */
  faCheck = faCheck;
  faArrowLeft = faArrowLeft;
  faRefresh = faRefresh;

  urlBackEnd: string = URL_BACKEND;
  urlImage: string = URL_IMAGE;
  contenidoWeb: ContenidoWeb = new ContenidoWeb();
  estados!: Estado[];
  ptipos!: Parametro[];
  contenidoWebCategorias!: ContenidoWebCategoria[];

  secciones!: string[];

  titulo: string = "Nuevo contenido web";
  errores!: Validacion[];

  tipo: string = "";

  loading: boolean = true;
  lcontenidoWeb: boolean = false;
  lestados: boolean = false;
  lptipos: boolean = false;
  lcategorias: boolean = false;

  modalServiceNotificacion!: Subscription;
  ventanaSubirImagen!: NgbModalRef;
  closeResult!: string;

  urlImagen!: string;
  urlBanner!: string;



  archivoSeleccionado!: File;
  archivoSeleccionado2!: File;
  imageSrc!: string;
  imageSrc2!: string;

  carga1: boolean = false;
  carga2: boolean = false;


  //VARIABLES FILE MANAGER
  ventanaFileManager!: NgbModalRef;

  tipoFileManager: string = "";
  imgSelected = "";

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
    defaultParagraphSeparator: '',
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
 private parametroService: ParametroService,
    private contenidoWebService: ContenidoWebService,
    private contenidoWebCategoriaService: ContenidoWebCategoriaService,
    public ngbService: NgbModal,
    public modalService: ModalService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = + params.get('id')!;
      localStorage.setItem("rnpm.admin.carpeta", "contenidoWeb");
      //nombre de la carpeta(cpanel/archivos)
      // localStorage.setItem("Yhassir.admin.carpeta", "contenidoWeb");//nombre de la carpeta(cpanel/archivos)

      if (id) {
        this.contenidoWebService.getContenidoWeb(id).subscribe((contenidoWeb) => {
          this.contenidoWeb = contenidoWeb;
          this.urlImagen = this.urlImage + '/archivos/contenidoWeb/' + ((this.contenidoWeb.urlImagen != null) ? this.contenidoWeb.urlImagen : 'imagen.png') + "?" + Math.random();
          this.urlBanner = this.urlImage + '/archivos/contenidoWeb/' + ((this.contenidoWeb.urlBanner != null) ? this.contenidoWeb.urlBanner : 'imagen.png') + "?" + Math.random();

          this.titulo = "Edición de contenido web";
        });
        this.lcontenidoWeb = true;
        this.actualizarCargador();
      } else {
        this.titulo = "Nuevo contenido web";
        this.urlImagen = this.urlImage + '/archivos/contenidoWeb/imagen.png';
        this.urlBanner = this.urlImage + '/archivos/contenidoWeb/imagen.png';
        this.contenidoWeb.nombre = "";

        this.contenidoWeb.contenido = "";
        this.contenidoWeb.orden = 0;
        this.contenidoWeb.tituloSeo = "";
        this.contenidoWeb.descripcionSeo = "";
        this.contenidoWeb.palabrasClaveSeo = "";

        this.contenidoWeb.estado = new Estado();
        this.contenidoWeb.estado.idEstado = 118;
        this.contenidoWeb.ptipo = new Parametro();
        this.contenidoWeb.ptipo.idParametro = 0;
        this.contenidoWeb.contenidoWebCategoria = new ContenidoWebCategoria();
        this.contenidoWeb.contenidoWebCategoria.idContenidoWebCategoria = 0;
        this.lcontenidoWeb = true;
        this.actualizarCargador();
      }

    });

    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 213, 0, 0))
      .pipe(
    ).subscribe(response => {
      this.estados = response.content as Estado[];
      this.lestados = true;
      this.actualizarCargador();
    });
    this.parametroService.getParametros(new ParametroFiltro('', '', '', '', 104, 305, 0, 0))
      .pipe(
    ).subscribe(response => {
      this.ptipos = response.content as Parametro[];
      this.lptipos = true;
      this.actualizarCargador();
    });

    this.contenidoWebCategoriaService.getContenidoWebCategorias(new ContenidoWebCategoriaFiltro('', '', '', '', 0, 0, 0, 0))
      .pipe(
    ).subscribe(response => {
      this.contenidoWebCategorias = response.content as ContenidoWebCategoria[];
      this.lcategorias = true;
      this.actualizarCargador();
    });

    this.modalServiceNotificacion = this.modalService.notificarEvento.subscribe(modal => {
      this.loading = true;

      if (modal.origen == "subirImg") {
        if (this.tipo == 'imagen') {
          this.archivoSeleccionado = modal.archivo;
          this.contenidoWeb.urlImagen = modal.archivo.name;
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imageSrc = e.target.result;
          };
          reader.readAsDataURL(this.archivoSeleccionado);
          this.loading = false;
          this.ventanaSubirImagen.close();

        } else if (this.tipo == 'banner') {
          this.archivoSeleccionado2 = modal.archivo;
          this.contenidoWeb.urlBanner = modal.archivo.name;
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imageSrc2 = e.target.result;
          };
          reader.readAsDataURL(this.archivoSeleccionado2);
          this.loading = false;
          this.ventanaSubirImagen.close();
        }
      } else if (modal.origen == "filemanager") {

        if (modal.retorno.imagen == true) {
          switch (this.tipoFileManager) {
            case 'contenido':
              this.imgSelected = '<img alt="" style="width:' + modal.retorno.ancho + 'px;height:' + modal.retorno.alto + 'px"  src="' + this.urlImage + '/archivos/' + modal.retorno.url + '">';
              break;

          }

        }
        this.loading = false;
        this.ventanaFileManager.close();
      }
    });

    window.scroll(0, 0);
  }


  eliminarMiniatura(contenidoWeb: ContenidoWeb) {
    this.loading = true;
    this.contenidoWebCategoriaService.contenidoWebEliminarImagen(contenidoWeb, 'miniatura')
      .subscribe(
        contenidoWeb => {
          this.contenidoWeb = contenidoWeb;
          this.urlImagen = "";
          this.imageSrc = this.urlImage + '/archivos/contenidoWeb/imagen.png';
          this.loading = false;
        }
      )
  }

  eliminarBanner(contenidoWeb: ContenidoWeb) {
    this.loading = true;
    this.contenidoWebCategoriaService.contenidoWebEliminarImagen(contenidoWeb, 'banner')
      .subscribe(
        contenidoWeb => {
          this.contenidoWeb = contenidoWeb;
          this.urlBanner = "";
          this.imageSrc2 = this.urlImage + '/archivos/contenidoWeb/imagen.png';

          this.loading = false;
        }
      )
  }


  fileManager(content: any, tipoFileManager: string) {
    this.tipoFileManager = tipoFileManager;
    this.ventanaFileManager = this.ngbService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaFileManager' });
    this.ventanaFileManager.result.then((e) => {
      this.closeResult = `Closed with: ${e}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  guardar(): void {
    this.loading = true;
    if (this.contenidoWeb.idContenidoWeb === undefined) {
      this.contenidoWebService.contenidoWebGuardar(this.contenidoWeb)
        .subscribe(
          contenidoWeb => {
            this.contenidoWeb = contenidoWeb;
            this.loading = false;
            this.router.navigate(['/contenido-web/lista/']);
            Swal.fire('Nuevo contenido web', `El contenido web "${contenidoWeb.nombre}" ha sido creado con éxito`, 'success');
          },
          err => {
            this.errores = err.error.errors as Validacion[];
            this.loading = false;

          }
        );

    } else {
      this.loading = true;
      this.contenidoWebService.contenidoWebActualizar(this.contenidoWeb)
        .subscribe(
          contenidoWeb => {
            if (this.archivoSeleccionado != null) {
              this.contenidoWebCategoriaService.contenidoWebUpload(this.archivoSeleccionado, this.contenidoWeb.idContenidoWeb, 'imagen').subscribe(contenidoWeb => {
                console.log('contenidoWeb: ' + contenidoWeb);
                this.contenidoWeb = contenidoWeb;
                this.urlImagen = this.urlImage + '/archivos/contenidoWeb/' + ((contenidoWeb.urlImagen != null) ? contenidoWeb.urlImagen : 'imagen.png') + "?" + Math.random();
                this.imageSrc = this.urlImage + '/archivos/contenidoWeb/' + ((contenidoWeb.urlImagen != null) ? contenidoWeb.urlImagen : 'imagen.png') + "?" + Math.random();
                this.loading = false;
                this.carga1 = true;
              },
                err => {
                  this.errores = err.error.errors as Validacion[];
                  console.error('Código del error desde el backend: ' + err.status);
                  console.error(err.error.errors);
                  this.loading = false;

                });

            }
            if (this.archivoSeleccionado2 != null) {
              this.contenidoWebCategoriaService.contenidoWebUpload(this.archivoSeleccionado2, this.contenidoWeb.idContenidoWeb, 'banner').subscribe(contenidoWeb => {
                console.log('contenidoWeb: ' + contenidoWeb);
                this.contenidoWeb = contenidoWeb;
                this.urlBanner = this.urlImage + '/archivos/contenidoWeb/' + ((contenidoWeb.urlBanner != null) ? contenidoWeb.urlBanner : 'imagen.png') + "?" + Math.random();
                this.imageSrc2 = this.urlImage + '/archivos/contenidoWeb/' + ((contenidoWeb.urlBanner != null) ? contenidoWeb.urlBanner : 'imagen.png') + "?" + Math.random();
                this.loading = false;
              },
                err => {
                  this.errores = err.error.errors as Validacion[];
                  console.error('Código del error desde el backend: ' + err.status);
                  console.error(err.error.errors);
                  this.loading = false;
                });

            }

            if (this.carga1 && this.carga2) {
              this.contenidoWebService.getContenidoWeb(this.contenidoWeb.idContenidoWeb).subscribe((contenidoWeb) => {
                this.contenidoWeb = contenidoWeb;
              })
            }
            this.loading = false;
            this.router.navigate(['/contenido-web/lista/']);
            Swal.fire('Contenido web actualizado', `El contenido web "${contenidoWeb.nombre}" ha sido actualizado con éxito`, 'success');
          },
          err => {
            this.errores = err.error.errors as Validacion[];
            console.error('Código del error desde el backend: ' + err.status);
            console.error(err);
          }
        )
    }
  }


  abrirModalSubirImg(content: any, tipo: string) {
    this.tipo = tipo;
    this.ventanaSubirImagen = this.ngbService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaSubirImagen' })
    this.ventanaSubirImagen.result.then((e) => {
      this.closeResult = `Closed with: ${e}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  keyup(event: any) {
    this.contenidoWeb.urlAmigable = this.convertirAUrl(this.contenidoWeb.nombre);

  }


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
  compararCategoria(o1: ContenidoWebCategoria, o2: ContenidoWebCategoria): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idContenidoWebCategoria === o2.idContenidoWebCategoria;
  }


  compararString(o1: string, o2: string): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1 === o2;
  }

  actualizarCargador() {
    this.loading = (this.lestados && this.lcategorias && this.lcontenidoWeb) ? false : true;
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
    cadena = cadena.replace(/\//g, "-");
    cadena = cadena.replace(/\\/g, "");
    cadena = cadena.replace(/\(/g, "");
    cadena = cadena.replace(/\)/g, "");
    return cadena;
  };



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

  generarUrl() {
    let contenido = this.contenidoWeb;
    let url = '';
    if (contenido.contenidoWebCategoria && contenido.contenidoWebCategoria.idContenidoWebCategoria > 0) {
      this.contenidoWebCategoriaService.getContenidoWebCategoria(contenido.contenidoWebCategoria.idContenidoWebCategoria).subscribe((cat) => {
        url += ((cat.rcontenidoWebCategoria?.rcontenidoWebCategoria) ? this.convertirAUrl(cat.rcontenidoWebCategoria?.rcontenidoWebCategoria.nombre) + '/' : '') +
          ((cat.rcontenidoWebCategoria) ? this.convertirAUrl(cat.rcontenidoWebCategoria.nombre) + '/' : '') +
          ((cat) ? this.convertirAUrl(cat.nombre) + '/' : '') +
          ((contenido.nombre) ? this.convertirAUrl(contenido.nombre) : '');
        this.contenidoWeb.urlAmigable = url;
      });
    } else {
      this.contenidoWeb.urlAmigable = this.convertirAUrl(this.contenidoWeb.nombre);
    }

  }

}
