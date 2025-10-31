import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import Swal from 'sweetalert2';


import { Subscription } from 'rxjs';
import { ModalDismissReasons, NgbModal, NgbModalRef, NgbModule, NgbNavLink, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

// import { AuthService } from '../../core/service/auth.service';
import { URL_BACKEND, URL_IMAGE } from '../../config/config';
import { Parametro } from '../../core/model/parametro';
import { Estado } from '../../core/model/estado';
import { Validacion } from '../../core/util/validacion';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { ModalService } from '../../core/service/modal.service';
import { EstadoFiltro } from '../../core/filter/estadoFiltro';
import { CommonModule } from '@angular/common';
import { NgxLoadingComponent, NgxLoadingModule } from 'ngx-loading';
//import { PaginatorModule } from '../../paginator/paginator.module';

import { AuthService } from '../../core/service/auth.service';
import { faArrowLeft, faCheck, faPen, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { FormacionUploadComponent } from '../upload/formacionUpload.component';

import { ParametroFiltro } from '../../core/filter/parametroFiltro';
// import { FormacionImagenUploadComponent } from '../imagenes/formacionImagenUpload.component';

import { id, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileManagerComponent } from '../../general/fileManager/fileManager.component';

import { ProyectoImagen } from '../../core/model/proyectoImagen';
import { ProyectoImagenFiltro } from '../../core/filter/proyectoImagenFiltro';
import { Formacion } from '../../core/model/formacion';
import { FormacionService } from '../../core/service/formacion.service';
import { EstadoService } from '../../core/service/estado.service';
import { ParametroService } from '../../core/service/parametro.service';


@Component({
  selector: 'app-formacionEditar',
  templateUrl: './formacionEditar.component.html',
  imports: [FileManagerComponent, AngularEditorModule, NgbNavLink, NgbNavModule, NgxDatatableModule, NgbModule, FontAwesomeModule, FormacionUploadComponent, RouterLink, NgbModule, CommonModule, FormsModule, ReactiveFormsModule, NgxLoadingModule],
  standalone: true,
  styleUrls: ['./formacionEditar.component.css'],
  providers: [ModalService,ParametroService, EstadoService, FormacionService, AuthService]
})
export class FormacionEditarComponent {

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
  formacion: Formacion = new Formacion();
  estados!: Estado[];
  idpcategorias!: Parametro[];

idpTipos  !: Parametro[];
idpDestacados!: Parametro[];
  //clientes!: Cliente[];
  imgSelected = "";


  proyectoImagenes!: ProyectoImagen[];
  proyectoImagenesFiltro!: ProyectoImagenFiltro;

  proyectoImagen: ProyectoImagen = new ProyectoImagen();
  erroresProyectoImagen!: Validacion[];


  ventanaSubirImagenes!: NgbModalRef;


  titulo: string = "Nueva formacion";
  errores!: Validacion[];
  loading: boolean = false;
  lformacion: boolean = false;
  lestados: boolean = false;
  lclientes: boolean = false;
  lptipos: boolean = false;
  lpdestacados: boolean = false;
  modalServiceNotificacion!: Subscription;
  ventanaSubirImagen!: NgbModalRef;
  closeResult!: string;

  tipoFileManager: string = "";
  ventanaFileManager!: NgbModalRef;


  urlImagen1!: string;
  destacado!: number;


  tipo: string = "";
  carga1: boolean = false;

  archivoSeleccionado!: File;
  archivoSeleccionado2!: File;
  imageSrc!: string;
  imageSrc2!: string;

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

     private parametroService: ParametroService,
    private estadoService: EstadoService,
    private formacionService: FormacionService,
    public ngbService: NgbModal,
    public modalService: ModalService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {


    this.activatedRoute.paramMap.subscribe(params => {
      let id = + params.get('id')!;
      localStorage.setItem("rnpm.admin.carpeta", "formacion");

      if (id) {
        // this.coreService.getProyectoImagen(id);

        this.formacionService.getFormacion(id).subscribe((formacion) => {
          this.formacion = formacion;

          this.formacion.idpTipo = formacion.idpTipo;
          this.formacion.palabrasClaveSeo = formacion.palabrasClaveSeo;
          this.formacion.tituloSeo = formacion.tituloSeo;
          this.formacion.descripcionSeo = formacion.descripcionSeo;
          console.log(formacion.idpTipo.idParametro);
          this.formacion.idpTipo = formacion.idpTipo;
          this.formacion.idpDestacado = formacion.idpDestacado;
          this.titulo = "Edición de formacion";
          this.urlImagen1 = this.urlImage + '/archivos/formacion/' + ((this.formacion.urlImagen != null) ? this.formacion.urlImagen : 'imagen.png') + "?" + Math.random();

        }, err => {
          this.errores = err as Validacion[];
          Swal.fire('Error', `${err.error}`, 'error');
          this.router.navigate(['/formacion/lista']);
        });


      } else {

        this.urlImagen1 = this.urlImage + '/archivos/formacion/imagen.png';
        this.formacion.nombre = "";
        this.formacion.descripcion = "";
        this.formacion.urlAmigable = "";
        this.formacion.urlImagen = "";
        this.formacion.orden = 1;

        this.formacion.palabrasClaveSeo = "";
        this.formacion.tituloSeo = "";
        this.formacion.descripcionSeo = "";
        this.formacion.estado = new Estado();
        this.formacion.estado.idEstado = 335;

        // this.proyecto.cliente = new Cliente();
        // this.proyecto.cliente.idCliente = 0;

        this.formacion.idpTipo = new Parametro();
        this.formacion.idpTipo.idParametro = 568;
        this.formacion.idpDestacado = new Parametro();
        this.formacion.idpDestacado.idParametro = 571;

      }
      this.lformacion = true;
      this.actualizarCargador();
    });



    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 320, 0, 0))
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.estados = response.content as Estado[];
        this.lestados = true;
        this.actualizarCargador();
      });

    this.parametroService.getParametros(new ParametroFiltro('', '', '', '', 104, 317, 0, 0))
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.idpTipos = response.content as Parametro[];
        this.lptipos = true;
        this.actualizarCargador();
      });


    this.parametroService.getParametros(new ParametroFiltro('', '', '', '', 104, 318, 0, 0))
    .pipe(
      tap(response => { })
    ).subscribe(response => {
      this.idpDestacados = response.content as Parametro[];
      this.lpdestacados = true;
      this.actualizarCargador();
    });


    // this.coreService.getClientes(new ClienteFiltro('', '', '', '', 0, 0, 0))
    //   .pipe(
    //     tap(response => { })
    //   ).subscribe(response => {
    //     this.clientes = response.content as Cliente[];
    //     let cliente = new Cliente();
    //     cliente.idCliente = 0;
    //     cliente.nombre = "Seleccione";
    //     this.clientes.push(cliente);
    //     this.lclientes = true;
    //     this.actualizarCargador();
    //   });

    // this.formacionService.getProyectosImagenes(this.proyectoImagenesFiltro)
    //   .pipe(
    //     tap(response => { })
    //   ).subscribe(response => {
    //     this.proyectoImagenes = response.content as ProyectoImagen[];
    //   });


    this.modalServiceNotificacion = this.modalService.notificarEvento.subscribe(modal => {
      console.log("RETORNO");
      // this.loading = true;
      console.log("origen modal " + modal.origen);
      if (modal.origen == "subirImgWeb") {
        this.archivoSeleccionado = modal.retorno;
        this.formacion.urlImagen = modal.retorno.name;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(this.archivoSeleccionado);
        this.loading = false;
        this.ventanaSubirImagen.close();

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

      else if (modal.origen == "cerrar") {
        this.loading = false;
        this.ventanaSubirImagenes.close();
      }
      window.scroll(0, 0);
    });

    // this.modalServiceNotificacion = this.modalService.notificarEvento.subscribe(modal => {
    //   console.log("RETORNO");
    //   this.loading = true;
    //   let archivoSeleccionado: File =modal.archivo;
    //   let contenido:Proyecto=modal.retorno;
    //   console.log("origen modal "+modal.origen);
    //   console.log("idcontenidoweb "+contenido.contenido);

    //   if (modal.origen == "subirImg") {
    //     if(this.tipo=='imagen'){
    //       this.archivoSeleccionado = modal.archivo;
    //       const reader = new FileReader();
    //       reader.onload = (e: any) => {
    //         this.imageSrc = e.target.result;
    //       };
    //       reader.readAsDataURL(this.archivoSeleccionado);
    //       this.loading = false;
    //       this.ventanaSubirImagen.close();

    //     }else if(this.tipo=='banner'){
    //       this.archivoSeleccionado2 = modal.archivo;
    //       const reader = new FileReader();
    //       reader.onload = (e: any) => {
    //         this.imageSrc2 = e.target.result;
    //       };
    //       reader.readAsDataURL(this.archivoSeleccionado2);
    //       this.loading = false;
    //       this.ventanaSubirImagen.close();
    //     }

    //     /*this.coreService.contenidoWebUpload(archivoSeleccionado, contenido.idContenidoWeb,this.tipo).subscribe(contenidoWeb => {
    //       //console.log('galeria: '+galeria);
    //       this.contenidoWeb = contenidoWeb;
    //       if(this.tipo=='imagen'){
    //         this.urlImagen = this.urlImage + '/archivos/contenidoWeb/' + contenidoWeb.urlImagen + "?" + Math.random();

    //       }else if(this.tipo=='banner'){
    //         this.urlBanner = this.urlImage + '/archivos/contenidoWeb/' + contenidoWeb.urlBanner + "?" + Math.random();
    //       }
    //       this.loading = false;
    //     });*/



    //   }else if (modal.origen == "filemanager") {

    //     if(modal.retorno.imagen==true){
    //       switch (this.tipoFileManager){
    //         case 'contenido':
    //           this.imgSelected='<img alt="" style="width:'+modal.retorno.ancho+'px;height:'+modal.retorno.alto+'px"  src="'+this.urlImage+'/archivos/'+modal.retorno.url+'">';
    //           break;

    //       }

    //     }
    //     this.loading = false;
    //     this.ventanaFileManager.close();
    //   }
    // });


  }

  ngOnDestroy() {
    this.modalServiceNotificacion.unsubscribe();
  }

  guardar(): void {
    console.log("Guardar: " + this.formacion.idFormacion);

    if (this.formacion.idFormacion === undefined) {

      console.log(this.formacion)
      this.formacionService.formacionGuardar(this.formacion)
        .subscribe(
          formacion => {
            this.formacion = formacion;
            console.log('formacion: ' + formacion);
            if (this.archivoSeleccionado != null) {
              this.formacionService.formacionUpload(this.archivoSeleccionado, this.formacion.idFormacion).subscribe(formacion => {
                this.urlImagen1 = this.urlImage + '/archivos/formacion/' + ((formacion.urlImagen != null) ? formacion.urlImagen : 'imagen.png') + "?" + Math.random();
                this.imageSrc = this.urlImage + '/archivos/formacion/' + ((formacion.urlImagen != null) ? formacion.urlImagen : 'imagen.png') + "?" + Math.random();
                this.carga1 = true;
              },
                err => {
                  this.errores = err.error.errors as Validacion[];
                  this.carga1 = true;
                });

            }

            this.loading = false;
            this.router.navigate(['/formacion/lista/']);
            Swal.fire('Nueva formacion', `La formacion "${formacion.nombre}" ha sido creado con éxito`, 'success');
          },
          err => {
            console.log(err);
            this.errores = err.error.errors as Validacion[];
          }
        );

    } else {
      console.log("Actualizar");
      console.log(this.formacion);

      this.formacionService.formacionActualizar(this.formacion).subscribe(
        formacion => {
          this.formacion = formacion;
          console.log('formacion actualizado:', formacion);

          if (this.archivoSeleccionado) {
            this.formacionService.formacionUpload(this.archivoSeleccionado, formacion.idFormacion).subscribe(
              formacionConImagen => {
                console.log('formacion después de subir imagen:', formacionConImagen);
                this.formacion = formacionConImagen;
                // const img = formacionConImagen.urlImagen ?? 'imagen.png';
                // const url = `${this.urlImage}/archivos/formacion/${img}?${Math.random()}`;
                // this.urlImagen1 = this.imageSrc = url;
                 this.urlImagen1 = this.urlImage + '/archivos/formacion/' + ((formacion.urlImagen != null) ? formacion.urlImagen : 'imagen.png') + "?" + Math.random();
                this.imageSrc = this.urlImage + '/archivos/formacion/' + ((formacion.urlImagen != null) ? formacion.urlImagen : 'imagen.png') + "?" + Math.random();
                this.loading = false;
                this.carga1 = true;
              },
              err => {
                this.errores = err.error.errors as Validacion[];
                this.loading = false;
                this.carga1 = true;
              }
            );
          } else {
            this.loading = false;
          }

          // Navegar y mostrar alerta después de la carga (idealmente cuando todo termine)
          this.router.navigate(['/formacion/lista']);
          Swal.fire(
            'formacion actualizado',
            `La formacion "${this.formacion.nombre}" ha sido actualizado con éxito`,
            'success'
          );
        },
        err => {
          this.errores = err.error.errors as Validacion[];
          this.loading = false;
        }
      );
    }

  }

  abrirModalSubirImg(content: any) {
    this.ventanaSubirImagen = this.ngbService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaSubirImagen' })
    this.ventanaSubirImagen.result.then((e) => {
      this.closeResult = `Closed with: ${e}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  // abrirModalSubirImagenes(content: any, idProyectoImagen: number) {
  //   this.erroresProyectoImagen = null!;
  //   if (idProyectoImagen > 0) {

  //     this.formacionService.getProyectoImagen(idProyectoImagen).subscribe((proyectoImagen) => {
  //       this.proyectoImagen = proyectoImagen;
  //     });
  //     this.ventanaSubirImagenes = this.ngbService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaSubirMuestras' })
  //     this.ventanaSubirImagenes.result.then((e) => {
  //       this.closeResult = `Closed with: ${e}`;
  //     }, (reason) => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //     });

  //   } else {
  //     //nuevo proyectoImagen
  //     this.proyectoImagen = new ProyectoImagen();
  //     this.ventanaSubirImagenes = this.ngbService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaSubirMuestras' })
  //     this.ventanaSubirImagenes.result.then((e) => {
  //       this.closeResult = `Closed with: ${e}`;
  //     }, (reason) => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //     });
  //   }



  // }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



  // eliminarProyectoImagen(proyectoImagen: ProyectoImagen): void {

  //   Swal.fire({
  //     title: 'Eliminar imagen de proyecto!',
  //     text: `¿Seguro que desea eliminar la imagen del proyecto "${proyectoImagen.proyecto.nombre}"?`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Si, eliminar!',
  //     cancelButtonText: 'No, cancelar!',
  //     customClass: {
  //       confirmButton: 'btn btn-success',
  //       cancelButton: 'btn btn-danger'
  //     },
  //     buttonsStyling: false,
  //     reverseButtons: true
  //   }).then((result) => {
  //     if (result.value) {
  //       this.formacionService.formacionImagenEliminar(proyectoImagen.idProyectoImagen).subscribe(
  //         () => {
  //           this.proyectoImagenes = this.proyectoImagenes.filter(cat => cat !== proyectoImagen)
  //           Swal.fire(
  //             'Imagen de proyecto eliminada!',
  //             `La imagen del proyecto "${proyectoImagen.proyecto.nombre}" se eliminó con éxito.`,
  //             'success'
  //           )
  //         }
  //       )

  //     }
  //   });
  // }

  eliminarImagen(formacion: Formacion) {
    this.loading = true;
    this.formacionService.formacionEliminarImagen(formacion)
      .subscribe(
        formacion => {
          this.formacion = formacion;
          this.imageSrc = this.urlImage + '/archivos/formacion/imagen.png';
          this.loading = false;
        }
      )
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


  keyup(event: any) {
    this.formacion.urlAmigable = this.convertirAUrl(this.formacion.nombre);

  }


  //comparadores
  compararEstado(o1: Estado, o2: Estado): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idEstado === o2.idEstado;
  }

  // compararCliente(o1: Cliente, o2: Cliente): boolean {
  //   if (o1 === undefined && o2 === undefined)
  //     return true;
  //   return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idCliente === o2.idCliente;
  // }

  compararParametro(o1: Parametro, o2: Parametro): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idParametro === o2.idParametro;
  }

  actualizarCargador() {
    this.loading = (this.lformacion && this.lestados && this.lptipos && this.lpdestacados) ? false : true;
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
