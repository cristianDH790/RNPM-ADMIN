import { Component } from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import Swal from 'sweetalert2';

import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../core/service/auth.service';

import { URL_IMAGE } from '../../config/config';
import { ContenidoWebCategoria } from '../../core/model/contenidoWebCategoria';
import { Estado } from '../../core/model/estado';
import { Parametro } from '../../core/model/parametro';
import { Validacion } from '../../core/util/validacion';
import { Subscription } from 'rxjs';
import { ModalService } from '../../core/service/modal.service';
import { EstadoFiltro } from '../../core/filter/estadoFiltro';
import { ParametroFiltro } from '../../core/filter/parametroFiltro';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { ContenidoWebCategoriaFiltro } from '../../core/filter/contenidoWebCategoriaFiltro';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ContenidoWebCategoriaService } from '../../core/service/contenidoWebCategorias.service';
import { EstadoService } from '../../core/service/estado.service';
import { ParametroService } from '../../core/service/parametro.service';




@Component({
  selector: 'app-contenidoWebCategoriaEditar',
  templateUrl: './contenidoWebCategoriaEditar.component.html',
  providers: [ParametroService, EstadoService, AuthService, ContenidoWebCategoriaService],
  imports: [FontAwesomeModule, NgxLoadingModule, FormsModule, MatSlideToggleModule, CommonModule, RouterLink],
  standalone: true
})
export class ContenidoWebCategoriaEditarComponent {

  faArrowLeft = faArrowLeft;
  faCheck = faCheck;

  urlBackEnd = URL_IMAGE;
  urlImage = URL_IMAGE;
  leng!: string;
  contenidoWebCategoria: ContenidoWebCategoria = new ContenidoWebCategoria();
  estados!: Estado[];
  psecciones!: Parametro[];
  rcontenidoWebCategorias!: ContenidoWebCategoria[];
  titulo: string = "Nueva categoría de contenido web";
  errores!: Validacion[];



  loading: boolean = true;
  lcontenidoWebCategoria: boolean = false;
  lestados: boolean = false;
  lrcontenidoWebCategorias: boolean = false;
  lpsecciones: boolean = false;


  modalServiceNotificacion!: Subscription;
  ventanaSubirImagen!: NgbModalRef;
  closeResult!: string;


  urlImagen!: string;

  archivoSeleccionado!: File;
  imageSrc!: string;

  constructor(
    private router: Router,

    private estadoService: EstadoService,
     private parametroService: ParametroService,
    private contenidoWebCategoriaService: ContenidoWebCategoriaService,
    public ngbService: NgbModal,
    public modalService: ModalService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute) {


  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = + params.get('id')!;
      if (id) {
        this.contenidoWebCategoriaService.getContenidoWebCategoria(id).subscribe((contenidoWebCategoria) => {
          this.contenidoWebCategoria = contenidoWebCategoria;
          this.titulo = "Edición de categoría de contenido web"
            ;
          if (contenidoWebCategoria.rcontenidoWebCategoria == null) {
            contenidoWebCategoria.rcontenidoWebCategoria = new ContenidoWebCategoria();
            contenidoWebCategoria.rcontenidoWebCategoria.idContenidoWebCategoria = null!;
          }
        });
        this.lcontenidoWebCategoria = true;
        this.actualizarCargador();

      } else {

        this.contenidoWebCategoria.estado = new Estado();
        this.contenidoWebCategoria.rcontenidoWebCategoria = new ContenidoWebCategoria();

        this.contenidoWebCategoria.estado.idEstado = 120;
        this.contenidoWebCategoria.rcontenidoWebCategoria.idContenidoWebCategoria = null!;
        this.contenidoWebCategoria.nombre = "";
        this.contenidoWebCategoria.orden = 0;
        this.contenidoWebCategoria.miniatura = false;
        this.contenidoWebCategoria.banner = false;

        this.lcontenidoWebCategoria = true;
        this.actualizarCargador();
      }

    });

    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 214, 0, 0))
      .pipe(
    ).subscribe(response => {
      this.estados = response.content as Estado[];
      this.lestados = true;
      this.actualizarCargador();
    });

    this.contenidoWebCategoriaService.getContenidoWebCategorias(new ContenidoWebCategoriaFiltro('', '', '', '', 0, 0, 0, 0))
      .pipe(
    ).subscribe(response => {
      this.rcontenidoWebCategorias = response.content as ContenidoWebCategoria[];
      this.lrcontenidoWebCategorias = true;
      this.actualizarCargador();
    });

    this.parametroService.getParametros(new ParametroFiltro('orden', 'asc', '', '', 104, 306, 0, 0))
      .pipe(
    ).subscribe(response => {
      this.psecciones = response.content as Parametro[];

      this.lpsecciones = true;
      this.actualizarCargador();
    });
    window.scroll(0, 0);
  }

  guardar(): void {
    this.loading = true;
    if (this.contenidoWebCategoria.idContenidoWebCategoria === undefined) {
      this.contenidoWebCategoriaService.contenidoWebCategoriaGuardar(this.contenidoWebCategoria)
        .subscribe(
          contenidoWebCategoria => {
            this.contenidoWebCategoria = contenidoWebCategoria;
            Swal.fire('Nueva categoría de contenido web', `La categoría "${contenidoWebCategoria.nombre}" ha sido creada con éxito`, 'success');
            this.router.navigate(['/contenido-web-categoria/lista']);
          },
          err => {
            this.errores = err.error.errors as Validacion[];
            this.loading = false;

          }
        );

    } else {
      this.contenidoWebCategoriaService.contenidoWebCategoriaActualizar(this.contenidoWebCategoria)
        .subscribe(
          contenidoWebCategoria => {
            if (this.archivoSeleccionado != null) {
              this.contenidoWebCategoriaService.contenidoWebCategoriaUpload(this.archivoSeleccionado, contenidoWebCategoria.idContenidoWebCategoria).subscribe(contenidoWebCategoria => {
                this.contenidoWebCategoria = contenidoWebCategoria;

                this.loading = false;
              });
            }

            this.router.navigate(['/contenido-web-categoria/lista']);
            Swal.fire('Categoría actualizada', `La categoría "${contenidoWebCategoria.nombre}" ha sido actualizada con éxito`, 'success');
          },
          err => {
            this.errores = err.error.errors as Validacion[];
            this.loading = false;

          }
        )
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


  setValueMiniatura(e: any) {
    if (e.checked) {
      this.contenidoWebCategoria.miniatura = true;
    } else {
      this.contenidoWebCategoria.miniatura = false;
    }

  }
  setValueBanner(e: any) {
    if (e.checked) {
      this.contenidoWebCategoria.banner = true;
    } else {
      this.contenidoWebCategoria.banner = false;
    }

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


  //comparadores
  compararEstado(o1: Estado, o2: Estado): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idEstado === o2.idEstado;
  }

  //comparadores
  compararParametro(o1: Parametro, o2: Parametro): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idParametro === o2.idParametro;
  }

  compararContenidoWebCategoria(o1: ContenidoWebCategoria, o2: ContenidoWebCategoria): boolean {
    if (o1 === undefined && o2 === undefined || o1 === null && o2 === null)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idContenidoWebCategoria === o2.idContenidoWebCategoria;
  }



  actualizarCargador() {
    this.loading = (this.lestados && this.lcontenidoWebCategoria && this.lrcontenidoWebCategorias && this.lpsecciones) ? false : true;
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
    cadena = cadena.replace(/\'/g, "");
    cadena = cadena.replace(/\"/g, "");
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
