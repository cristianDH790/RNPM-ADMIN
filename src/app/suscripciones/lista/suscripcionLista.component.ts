import { Component, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { Suscripcion } from '../../core/model/suscripcion';

import { Estado } from '../../core/model/estado';
import { TipoFiltro } from '../../core/filter/tipoFiltro';
import { EstadoFiltro } from '../../core/filter/estadoFiltro';
import { saveAs } from "file-saver";
import { SuscripcionFiltro } from '../../core/filter/suscripcionFiltro';

import { AuthService } from '../../core/service/auth.service';
import { ModalService } from '../../core/service/modal.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SliderUpload2Component } from '../../sliders/upload2/sliderUpload2.component';
import { SliderUploadComponent } from '../../sliders/upload/sliderUpload.component';
import { NgxLoadingModule } from 'ngx-loading';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { Paginator } from '../../core/util/paginator';
import { faArrowLeft, faList, faPencil, faRefresh, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SuscripcionService } from '../../core/service/suscripcion.service';
import { EstadoService } from '../../core/service/estado.service';

@Component({
  templateUrl: './suscripcionLista.component.html',
  imports: [FontAwesomeModule, RouterLink, CommonModule, FormsModule, ReactiveFormsModule, AngularEditorModule, NgxLoadingModule, PaginatorComponent],
  standalone: true,
  providers: [ModalService, EstadoService, AuthService, SuscripcionService]
})
export class SuscripcionListaComponent {



  faTrash = faTrash;
  faPencil = faPencil;
  faSearch = faSearch;
  faRefresh = faRefresh;
  faList = faList;
  faArrowLeft = faArrowLeft;

  public paginator = signal<Paginator | null>(null);
  suscripcionFiltro: SuscripcionFiltro = new SuscripcionFiltro('correo', 'asc', 'correo', '', 0, 1, 10);
  estados: Estado[];
  suscripciones: Suscripcion[];

  paginador: any;

  loading: boolean = true;
  lsuscripciones: boolean = false;
  lestados: boolean = false;
  ltipos: boolean = false;

  constructor(

    private estadoService: EstadoService,
    private suscripcionService: SuscripcionService,
    public authService: AuthService) {

    this.suscripciones = new Array() as Array<Suscripcion>;
    this.estados = new Array() as Array<Estado>;



    if (localStorage.getItem("rnpm.admin.filtroSuscripciones") != null) {
      this.suscripcionFiltro = JSON.parse(localStorage.getItem("rnpm.admin.filtroSuscripciones")!);
    }
    this.suscripcionService.getSuscripciones(this.suscripcionFiltro)
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.paginator.set(response.paginator);
        this.suscripciones = response.content as Suscripcion[];
        this.lsuscripciones = true;
        this.actualizarCargador();
      });


    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 321, 0, 0))
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.estados = response.content as Estado[];
        this.lestados = true;
        this.actualizarCargador();
      });

  }

  ngOnInit(): void {
  }

  restablecer() {

    localStorage.removeItem("rnpm.admin.filtroSuscripciones");

    this.suscripcionFiltro.ordenCriterio = 'correo';
    this.suscripcionFiltro.ordenTipo = 'asc';
    this.suscripcionFiltro.parametro = 'correo';
    this.suscripcionFiltro.valor = '';
    this.suscripcionFiltro.idEstado = 0;
    this.suscripcionFiltro.pagina = 1;
    this.suscripcionFiltro.registros = 10;
    this.actualizar();

  }
  actualizarPaginacion(evento: any): void {
    this.loading = true;
    this.actualizar();
  }
  cambiarPagina(pagina: number) {
    this.loading = true;
    this.suscripcionFiltro.pagina = pagina;
    this.actualizar();
  }

  actualizar(): void {
    this.loading = true;
    localStorage.setItem("bellaCuret.admin.filtroSuscripciones", JSON.stringify(this.suscripcionFiltro));
    this.suscripcionService.getSuscripciones(this.suscripcionFiltro)
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.paginator.set(response.paginator);
        this.suscripciones = response.content as Suscripcion[];
        this.loading = false;
      });
  }

  eliminar(suscripcion: Suscripcion): void {

    Swal.fire({
      title: 'Eliminar suscripcion!',
      text: `¿Seguro que desea eliminar la suscripción de "${suscripcion.correo}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',

      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.suscripcionService.suscripcionEliminar(suscripcion.idSuscripcion).subscribe(
          () => {
            this.suscripciones = this.suscripciones.filter(cat => cat !== suscripcion)
            this.actualizar();
            Swal.fire(
              'Suscripcion eliminado!',
              `La suscripcion de "${suscripcion.correo}" se eliminó con éxito.`,
              'success'
            )
          }
        )

      }
    });
  }

  reporte(suscripcionFiltro: SuscripcionFiltro) {
    Swal.fire({
      title: 'Reporte excel',
      text: `¿Está seguro que desea generar reporte con los filtros actuales?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#e72181', // color personalizado para botón "Sí"
      cancelButtonColor: '#666',     // color personalizado para botón "No"
      confirmButtonText: 'Sí, generar!',
      cancelButtonText: 'No, cancelar!',
      customClass: {
        confirmButton: 'btn',  // Puedes mantener clases si usas Bootstrap, pero ya no `btn-success`
        cancelButton: 'btn'
      },
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      this.loading = true;

      if (result.value) {
        let fecha = new Date();
        let nombreArchivo: string = "reporte-suscripciones-" + fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate() + '-' + fecha.getHours() + '-' + fecha.getMinutes() + ".xlsx";

        this.suscripcionService.getReporteSuscripcion(suscripcionFiltro).subscribe(response => {
          saveAs(response, nombreArchivo);
          Swal.fire(
            'Generar reporte',
            `El reporte se generó con éxito.`,
            'success'
          );
          this.loading = false;
        }, err => {
          Swal.fire(
            'Generar reporte',
            `El reporte no se pudo generar.`,
            'warning'
          );
          this.loading = false;
          console.error(err);
        });

      } else {
        this.loading = false;
      }
    });

  }

  actualizarCargador() {
    this.loading = (this.lestados && this.lsuscripciones) ? false : true;
  }
}
