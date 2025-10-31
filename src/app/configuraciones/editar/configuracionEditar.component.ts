import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

import { config, Subscription } from 'rxjs';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../core/service/auth.service';
import { URL_IMAGE } from '../../config/config';
import { Configuracion } from '../../core/model/configuracion';
import { Parametro } from '../../core/model/parametro';
import { Validacion } from '../../core/util/validacion';
import { ModalService } from '../../core/service/modal.service';
import { ParametroFiltro } from '../../core/filter/parametroFiltro';
import { ConfiguracionUploadComponent } from '../upload/configuracionUpload.component';
import { NgxLoadingModule } from 'ngx-loading';
import { CommonModule, NgClass } from '@angular/common';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TipoService } from '../../core/service/tipo.service';
import { ParametroService } from '../../core/service/parametro.service';
import { ConfiguracionService } from '../../core/service/configuracion.service';


@Component({
  selector: 'app-configuracionEditar',
  templateUrl: './configuracionEditar.component.html',
  providers: [ ParametroService, ConfiguracionService, AuthService],
  standalone: true,
  imports: [FontAwesomeModule, ConfiguracionUploadComponent, NgxLoadingModule, RouterLink, CommonModule, FormsModule]
})
export class ConfiguracionEditarComponent {

  /*Font Awesome Iconos*/
  faCheck = faCheck;
  faArrowLeft = faArrowLeft;
  /*Fin Font awesome */

  urlBackEnd = URL_IMAGE;
  urlImage = URL_IMAGE;
  configuracion: Configuracion = new Configuracion();
  ptipos!: Parametro[];


  titulo: string = "Nueva configuración";
  errores!: Validacion[];

  loading: boolean = true;
  lconfiguracion: boolean = false;
  lptipos: boolean = false;


  modalServiceNotificacion!: Subscription;
  ventanaSubirImagen!: NgbModalRef;
  closeResult!: string;

  urlImagen!: string;

  archivoSeleccionado!: File;
  imageSrc!: string;

  constructor(
    private router: Router,
    private configuracionService: ConfiguracionService,
    private parametroService: ParametroService,
    public ngbService: NgbModal,
    public modalService: ModalService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = + params.get('id')!;
      if (id) {
        this.configuracionService.getConfiguracion(id).subscribe((configuracion) => {
          this.configuracion = configuracion;
          this.urlImagen = this.urlBackEnd + '/archivos/configuracion/' + ((this.configuracion.urlImagen != null) ? this.configuracion.urlImagen : 'imagen.png') + "?" + Math.random();
        });
        this.titulo = "Edición de configuración";


        console.log(this.urlImagen);

      } else {

        this.urlImagen = this.urlBackEnd + '/archivos/configuracion/imagen.png';


        this.configuracion.nombre = "";
        this.configuracion.valor = "";
        this.configuracion.descripcion = "";

        this.configuracion.ptipo = new Parametro();
        this.configuracion.ptipo.idParametro = 532;
      }
      this.lconfiguracion = true;
      this.actualizarCargador();
    });




    this.parametroService.getParametros(new ParametroFiltro('', '', '', '', 104, 292, 0, 0))
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.ptipos = response.content as Parametro[];
        this.lptipos = true;
        this.actualizarCargador();
      });


    this.modalServiceNotificacion = this.modalService.notificarEvento.subscribe(modal => {
      console.log("RETORNO");
      this.loading = true;
      this.archivoSeleccionado = modal.retorno;
      this.configuracion.urlImagen = modal.retorno.name;
      if (modal.origen == "subirArchivo") {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageSrc = e.target.result;
        };
        reader.readAsDataURL(this.archivoSeleccionado);
        this.ventanaSubirImagen.close();
      }

      this.loading = false;


    });


  }
  ngOnDestroy() {
    this.modalServiceNotificacion.unsubscribe();
  }


  guardar(): void {
    this.loading = true;
    if (this.configuracion.idConfiguracion === undefined) {
      this.configuracionService.configuracionGuardar(this.configuracion)
        .subscribe(
          configuracion => {
            this.configuracion = configuracion;
            if (this.archivoSeleccionado != null) {

              this.configuracionService.configuracionUpload(this.archivoSeleccionado, this.configuracion.idConfiguracion).subscribe(configuracion => {
                console.log('configuracion: ' + configuracion);
                this.configuracion = configuracion;
                this.urlImagen = this.urlBackEnd + '/archivos/configuracion/' + ((configuracion.urlImagen != null) ? configuracion.urlImagen : 'imagen.png') + "?" + Math.random();
                this.imageSrc = this.urlBackEnd + '/archivos/configuracion/' + ((configuracion.urlImagen != null) ? configuracion.urlImagen : 'imagen.png') + "?" + Math.random();

                this.loading = false;
              });
            }

            this.router.navigate(['/configuraciones/lista']);
            Swal.fire('Nueva configuración', `La configuración "${configuracion.nombre}" ha sido creada con éxito`, 'success');
          },
          err => {
            this.errores = err.error.errors as Validacion[];
            this.loading = false;

          }
        );

    } else {
      this.configuracionService.configuracionActualizar(this.configuracion)
        .subscribe(
          configuracion => {

            if (this.archivoSeleccionado != null) {
              this.configuracionService.configuracionUpload(this.archivoSeleccionado, this.configuracion.idConfiguracion).subscribe(configuracion => {
                console.log('configuracion: ' + configuracion);
                this.configuracion = configuracion;
                this.urlImagen = this.urlBackEnd + '/archivos/configuracion/' + ((configuracion.urlImagen != null) ? configuracion.urlImagen : 'imagen.png') + "?" + Math.random();
                this.imageSrc = this.urlBackEnd + '/archivos/configuracion/' + ((configuracion.urlImagen != null) ? configuracion.urlImagen : 'imagen.png') + "?" + Math.random();

                this.loading = false;
              });
            }
            this.router.navigate(['/configuraciones/lista']);
            Swal.fire('Configuración actualizada', `La configuración "${configuracion.nombre}" ha sido actualizada con éxito`, 'success');
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
  compararParametro(o1: Parametro, o2: Parametro): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idParametro === o2.idParametro;
  }


  eliminarImagen(configuracion: Configuracion) {
    this.loading = true;
    this.configuracionService.configuracionEliminarImagen(configuracion)
      .subscribe(
        configuracion => {
          this.configuracion = configuracion;
          this.urlImagen = "";
          this.imageSrc = this.urlImage + '/archivos/configuracion/imagen.png';
          this.loading = false;
        }
      )
  }



  actualizarCargador() {
    this.loading = (this.lptipos && this.lconfiguracion) ? false : true;
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
