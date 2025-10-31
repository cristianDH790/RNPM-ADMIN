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
import { AlianzaUploadComponent } from "../upload/alianzaUpload.component";

import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND, URL_IMAGE } from '../../config/config';
import { Subscription } from 'rxjs';
import { ModalService } from '../../core/service/modal.service';
import { FileManagerComponent } from '../../general/fileManager/fileManager.component';
import { Alianza } from '../../core/model/alianza';
import { AlianzaService } from '../../core/service/alianza.service';
import { EstadoService } from '../../core/service/estado.service';

@Component({
  selector: 'app-alianzaEditar',
  templateUrl: './alianzaEditar.component.html',
  styleUrls: ['./alianzaEditar.component.css'],
  providers: [EstadoService ,AlianzaService, AuthService],
  imports: [FontAwesomeModule, RouterLink, CommonModule, FormsModule,AngularEditorModule,FileManagerComponent, NgxLoadingModule, AlianzaUploadComponent],
  standalone: true
})
export class AlianzaEditarComponent {

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
   alianza: Alianza = new Alianza();
   estados!: Estado[];
   pcategorias!: Parametro[];


   ventanaSubirImagenes!: NgbModalRef;

   titulo: string = "Nueva alianza";
   errores!: Validacion[];
   loading: boolean = false;
   lalianza: boolean = false;
   lestados: boolean = false;
   lclientes: boolean = false;
   lpcategorias: boolean = false;
   modalServiceNotificacion!: Subscription;
   ventanaSubirImagen!: NgbModalRef;
   closeResult!: string;

   tipoFileManager: string = "";
   ventanaFileManager!: NgbModalRef;


   urlImagen!: string;

   carga1: boolean = false;
   imgSelected="";

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
  
    private alianzaService: AlianzaService,
    private activatedRoute: ActivatedRoute,
    public ngbService: NgbModal,
    public modalService: ModalService,
    private authService: AuthService,
  ) {

  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = + params.get('id')!;
      localStorage.setItem("rnpm.admin.carpeta", "alianza");//nombre de la carpeta(cpanel/archivos)

      if (id) {

        this.alianzaService.getAlianza(id).subscribe((alianza) => {
          this.alianza = alianza;
          this.titulo = "Edición de alianza";
          this.urlImagen = this.urlImage + '/archivos/alianza/' + ((this.alianza.urlImagen != null) ? this.alianza.urlImagen : 'imagen.png') + "?" + Math.random();

        }, err => {
          this.errores = err as Validacion[];
          Swal.fire('Error', `${err.error}`, 'error');
          this.router.navigate(['/alianzas/lista']);
        });


      } else {

        this.urlImagen = this.urlImage + '/archivos/alianza/imagen.png';
       // this.urlImagen1 = '';
        this.alianza.nombre = "";
        this.alianza.descripcion = "";
        this.alianza.urlImagen ="";
        this.alianza.orden = 1;

        this.alianza.estado = new Estado();
        this.alianza.estado.idEstado = 408;



      }
      this.lalianza = true;
      this.actualizarCargador();
    });



    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 331, 0, 0))
      .pipe(

      ).subscribe(response => {
        this.estados = response.content as Estado[];
        this.lestados = true;
        this.actualizarCargador();
      });




    this.modalServiceNotificacion = this.modalService.notificarEvento.subscribe(modal => {
      console.log("RETORNO");
      this.loading = true;

      if (modal.origen == "subirImgWeb") {
        this.archivoSeleccionado = modal.retorno;
        this.alianza.urlImagen = modal.retorno.name;
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
              this.loading=false
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
    console.log("Guardar: " + this.alianza.idAlianza);

    if (this.alianza.idAlianza === undefined) {

      console.log(this.alianza)
      this.alianzaService.alianzaGuardar(this.alianza)
        .subscribe(
          alianza => {
            this.alianza = alianza;
            console.log('alianza: ' + alianza);
            if (this.archivoSeleccionado != null) {
              this.alianzaService.alianzaUpload(this.archivoSeleccionado, this.alianza.idAlianza).subscribe(alianza => {
                this.urlImagen = this.urlImage + '/archivos/alianza/' + ((alianza.urlImagen != null) ? alianza.urlImagen : 'imagen.png') + "?" + Math.random();
                this.imageSrc = this.urlImage + '/archivos/alianza/' + ((alianza.urlImagen != null) ? alianza.urlImagen : 'imagen.png') + "?" + Math.random();
                this.carga1 = true;
              },
                err => {
                  this.errores = err.error.errors as Validacion[];
                  this.carga1 = true;
                });

            }

            this.loading = false;
            this.router.navigate(['/alianzas/lista/']);
            Swal.fire('Nueva alianza', `La alianza "${alianza.nombre}" ha sido creado con éxito`, 'success');
          },
          err => {
            console.log(err);
            this.errores = err.error.errors as Validacion[];
          }
        );

    } else {
      console.log("Actualizar");
      console.log(this.alianza);

      this.alianzaService.alianzaActualizar(this.alianza)
        .subscribe(
          alianza => {
            this.alianza = alianza;
            console.log('noticia: ' + alianza.idAlianza);
            if (this.archivoSeleccionado != null) {
              this.alianzaService.alianzaUpload(this.archivoSeleccionado, this.alianza.idAlianza).subscribe(alianza => {
                console.log('alianza: ' + alianza);
                this.alianza = alianza;
                this.urlImagen = this.urlImage + '/archivos/alianza/' + ((alianza.urlImagen != null) ? alianza.urlImagen : 'imagen.png') + "?" + Math.random();
                this.imageSrc = this.urlImage + '/archivos/alianza/' + ((alianza.urlImagen != null) ? alianza.urlImagen : 'imagen.png') + "?" + Math.random();
                this.loading = false;
                this.carga1 = true;
              },
                err => {
                  this.errores = err.error.errors as Validacion[];
                  this.carga1 = true;
                });

            }

            this.router.navigate(['/alianzas/lista']);
            Swal.fire('alianza actualizado', `La alianza "${alianza.nombre}" ha sido actualizado con éxito`, 'success');
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

actualizarCargador() {
  this.loading = (this.lalianza && this.lestados) ? false : true;
}
  abrirModalSubirImg(content: any) {
    this.ventanaSubirImagen = this.ngbService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaSubirImagen' })
    this.ventanaSubirImagen.result.then((e) => {
      this.closeResult = `Closed with: ${e}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  eliminarImagen(alianza: Alianza) {
    this.loading = true;
    this.alianzaService.alianzaEliminarImagen(alianza)
      .subscribe(
        alianza => {
          this.alianza = alianza;
          this.imageSrc = this.urlImage + '/archivos/alianza/imagen.png';
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
