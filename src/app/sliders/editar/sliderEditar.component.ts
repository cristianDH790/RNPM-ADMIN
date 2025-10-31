import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { URL_IMAGE } from '../../config/config';
import { Slider } from '../../core/model/slider';
import { Parametro } from '../../core/model/parametro';
import { Estado } from '../../core/model/estado';
import { Validacion } from '../../core/util/validacion';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { ModalService } from '../../core/service/modal.service';
import { ParametroFiltro } from '../../core/filter/parametroFiltro';
import { EstadoFiltro } from '../../core/filter/estadoFiltro';
import { CommonModule } from '@angular/common';
import { NgxLoadingModule } from 'ngx-loading';

import { AuthService } from '../../core/service/auth.service';
import { SliderUploadComponent } from '../upload/sliderUpload.component';
import { SliderUpload2Component } from '../upload2/sliderUpload2.component';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


import { SliderService } from '../../core/service/slider.service';
import { EstadoService } from '../../core/service/estado.service';
import { ParametroService } from '../../core/service/parametro.service';

@Component({
  selector: 'app-sliderEditar',
  templateUrl: './sliderEditar.component.html',
  imports: [FontAwesomeModule, SliderUpload2Component, SliderUploadComponent, RouterLink, CommonModule, FormsModule, ReactiveFormsModule, AngularEditorModule, NgxLoadingModule],
  standalone: true,
  styleUrls: ['./sliderEditar.component.css'],
  providers: [ModalService, ParametroService, EstadoService, SliderService, AuthService]
})
export class SliderEditarComponent {

  /* Font Awesome Iconos*/
  faCheck = faCheck;
  faArrowLeft = faArrowLeft;
  /* Fin Font awesome */

  urlImage = URL_IMAGE;
  titulo: string = "Nuevo slider";
  slider: Slider = new Slider();

  pcategorias: Parametro[] = [];

  errores: Validacion[] = [];
  estados: Estado[] = [];

  /*Cargadores*/
  loading: boolean = true;
  lslider: boolean = false;
  lestados: boolean = false;
  lcategorias: boolean = false;
  lproductoCategorias: boolean = false;

  /* Modal */
  modalServiceNotificacion!: Subscription;
  ventanaSubirImagen!: NgbModalRef;
  closeResult!: string;

  // urlImagen1!: string;
  // urlImagen2!: string;

  // carga1: boolean = false;
  // carga2: boolean = false;

  imageSrc!: string;
  imageSrc2!: string;
  archivoSeleccionado!: File | null;
  archivoSeleccionado2!: File | null;

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

  constructor(
    private router: Router,

    private estadoService: EstadoService,
    private parametroService: ParametroService,
    private sliderService: SliderService,
    public ngbService: NgbModal,
    public modalService: ModalService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = + params.get('id')!;
      localStorage.setItem("rnpm.admin.carpeta", "slider");//nombre de la carpeta(cpanel/archivos)
      if (id) {

        this.sliderService.getSlider(id).subscribe((slider) => {
          console.log("slider")
          console.log(slider)
          this.slider = slider;
          this.titulo = "Edición de slider";
          this.imageSrc = this.urlImage + '/archivos/slider/' + ((this.slider.urlImagen1 != null) ? this.slider.urlImagen1 : 'imagen.png') + "?" + Math.random();
          this.imageSrc2 = this.urlImage + '/archivos/slider/' + ((this.slider.urlImagen2 != null) ? this.slider.urlImagen2 : 'imagen.png') + "?" + Math.random();

        }, err => {
          this.errores = err as Validacion[];
          Swal.fire('Error', `${err.error}`, 'error');
          this.router.navigate(['/slider/lista']);
        });


      } else {
        this.slider.estado = new Estado();
        this.slider.pcategoria = new Parametro();
        //this.slider.productoCategoria = new ProductoCategoria();

        this.imageSrc = this.urlImage + '/archivos/slider/imagen.png';
        this.imageSrc2 = this.urlImage + '/archivos/slider/imagen.png';
        //this.slider.productoCategoria.idProductoCategoria = 0;
        this.slider.nombre = "";
        this.slider.urlRecurso = "";
        this.slider.orden = 1;
        this.slider.estado.idEstado = 304;
        this.slider.pcategoria.idParametro = 0;

      }
      this.lslider = true;
      this.actualizarCargador();
    });

    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 253, 0, 0))
      .pipe(
    ).subscribe(response => {
      this.estados = response.content as Estado[];
      this.lestados = true;
      this.actualizarCargador();
    });

    this.parametroService.getParametros(new ParametroFiltro('', '', '', '', 104, 281, 0, 0))
      .pipe(
    ).subscribe(response => {
      this.pcategorias = response.content as Parametro[];
      let pcategoria = new Parametro();
      pcategoria.idParametro = 0;
      pcategoria.nombre = "Seleccione";
      this.pcategorias.push(pcategoria);
      this.lcategorias = true;
      this.actualizarCargador();
    });

    // this.coreService.getProductoCategorias(new ProductoCategoriaFiltro('', '', '', '', 323, 0, 0, 0))
    //   .pipe(
    // ).subscribe(response => {
    //   this.productoCategorias = response.content as ProductoCategoria[];
    //   this.productoCategorias = this.productoCategorias.filter(pc => pc.rProductoCategoria == null)
    //   this.lproductoCategorias = true;
    //   this.actualizarCargador();
    // });

    this.modalServiceNotificacion = this.modalService.notificarEvento.subscribe(modal => {
      this.loading = true;
      if (modal.origen == "subirImgWeb") {
        this.archivoSeleccionado = modal.retorno;
        this.slider.urlImagen1 = modal.retorno.name;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(this.archivoSeleccionado!);
        this.loading = false;
        this.ventanaSubirImagen.close();
      } else if (modal.origen == "subirImgMovil") {
        this.archivoSeleccionado2 = modal.retorno;
        this.slider.urlImagen2 = modal.retorno.name;

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc2 = e.target.result;
        };
        reader.readAsDataURL(this.archivoSeleccionado2!);
        this.loading = false;
        this.ventanaSubirImagen.close();
      }
    });
    //this.loading = false;
    window.scroll(0, 0);
    //this.loading = false;
  }


  ngOnDestroy() {
    this.modalServiceNotificacion.unsubscribe();
  }

  guardar(): void {
    this.loading = true;

    const sliderAction = this.slider.idSlider ?
      this.sliderService.sliderActualizar(this.slider) :
      this.sliderService.sliderGuardar(this.slider)

    sliderAction
      .subscribe(
        slider => {
          if (this.archivoSeleccionado) {
            this.sliderService.sliderUpload(this.archivoSeleccionado, slider.idSlider).subscribe(slider => { },
              err => {
                this.errores = err.error.errors as Validacion[];
                this.loading = false;
              });
          }
          if (this.archivoSeleccionado2) {
            this.sliderService.sliderUpload2(this.archivoSeleccionado2, slider.idSlider).subscribe(slider => {
            },
              err => {
                this.errores = err.error.errors as Validacion[];
                this.loading = false;

              });
          }

          this.loading = false;
          this.router.navigate(['/sliders/lista/']);
          Swal.fire(`${this.slider.idSlider ? 'Actualizar' : 'Nuevo'} slider`, `El slider "${slider.nombre}" ha sido ${this.slider.idSlider ? 'creado' : 'actualizado'} con éxito`, 'success');
        },
        err => {
          this.errores = err.error.errors as Validacion[];
          this.loading = false;
        }
      );
  }

  abrirModalSubirImg(content: any) {
    this.ventanaSubirImagen = this.ngbService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaSubirImagen' })
    this.ventanaSubirImagen.result.then((e) => {
      this.closeResult = `Closed with: ${e}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  abrirModalSubirImg2(content: any) {
    this.ventanaSubirImagen = this.ngbService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaSubirImagen2' })
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


  eliminarImagen(slider: Slider, tipo: string) {
    this.loading = true;
    if (slider.idSlider) {
      this.sliderService.sliderEliminarImagen(slider, tipo)
        .subscribe(
          slider => {
            this.slider = slider;
            if (tipo == 'urlImagen1') {
              this.imageSrc = this.urlImage + '/archivos/slider/imagen.png';
              this.slider.urlImagen1 = "";
              this.archivoSeleccionado = null;
              this.loading = false;
            } else if (tipo == 'urlImagen2') {
              this.imageSrc2 = this.urlImage + '/archivos/slider/imagen.png';
              this.slider.urlImagen2 = "";
              this.archivoSeleccionado2 = null;
              this.loading = false;
            }
          }
        )
    } else {
      if (tipo == 'urlImagen1') {
        this.imageSrc = this.urlImage + '/archivos/slider/imagen.png';
        this.slider.urlImagen1 = "";
        this.archivoSeleccionado = null;
        this.loading = false;
      } else if (tipo == 'urlImagen2') {
        this.imageSrc2 = this.urlImage + '/archivos/slider/imagen.png';
        this.slider.urlImagen2 = "";
        this.archivoSeleccionado2 = null;
        this.loading = false;
      }
    }
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


  actualizarCargador() {
    this.loading = (this.lslider && this.lestados && this.lcategorias) ? false : true;
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
