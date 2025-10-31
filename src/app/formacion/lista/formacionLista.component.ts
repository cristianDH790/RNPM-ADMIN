import { Component, signal } from '@angular/core';
import { tap } from 'rxjs/operators';



import { URL_BACKEND, URL_IMAGE } from '../../config/config';
import { Estado } from '../../core/model/estado';
import { EstadoFiltro } from '../../core/filter/estadoFiltro';

import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';


import { AuthService } from '../../core/service/auth.service';
import { faArrowLeft, faNewspaper, faPencil, faRefresh, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { ProyectoFiltro } from '../../core/filter/proyectoFiltro';
import { Paginator } from '../../core/util/paginator';
import { Proyecto } from '../../core/model/proyecto';
import { FormacionFiltro } from '../../core/filter/formacionFiltro';
import { Formacion } from '../../core/model/formacion';
import { ParametroFiltro } from '../../core/filter/parametroFiltro';
import { Parametro } from '../../core/model/parametro';
import { FormacionService } from '../../core/service/formacion.service';
import { EstadoService } from '../../core/service/estado.service';
import { ParametroService } from '../../core/service/parametro.service';

@Component({
  templateUrl: './formacionLista.component.html',
  providers: [FormacionService,ParametroService, EstadoService,  AuthService],
  standalone: true,
  styleUrls: ['./formacionLista.component.css'],
  imports: [NgbModule, FontAwesomeModule, RouterModule, PaginatorComponent, RouterLink, CommonModule, FormsModule, NgxLoadingModule]
})
export class FormacionListaComponent {

  public paginator = signal<Paginator | null>(null);

  /*Font Awesome Iconos*/
  faTrash = faTrash;
  faPencil = faPencil;
  faSearch = faSearch;
  faRefresh = faRefresh;
  faNewspaper = faNewspaper;
  faArrowLeft = faArrowLeft;
  /*Fin Font Awesome Iconos*/

  urlBackEnd = URL_BACKEND;
  urlImage = URL_IMAGE;
  formacionFiltro: FormacionFiltro = new FormacionFiltro('', '', '', '', 0, 0, 0, 0, 0);

  estados: Estado[];
  formaciones: Formacion[];

  paginador: any;

  loading: boolean = true;
  lestados: boolean = false;
  lformacion: boolean = false;
  idpTipos  !: Parametro[];
  idpDestacados!: Parametro[];
  lptipos: boolean = false;
  lpdestacados: boolean = false;

  constructor(
    private formacionService: FormacionService,
    private estadoService: EstadoService,
     private parametroService: ParametroService,
  ) {
    this.formaciones = new Array() as Array<Formacion>;
    this.estados = new Array() as Array<Estado>;

    if (localStorage.getItem("rnpm.admin.filtroFormacion") != null) {
      this.formacionFiltro = JSON.parse(localStorage.getItem("rnpm.admin.filtroFormacion")!);
    } else {
      this.filtroInicio();
    }

    this.formacionService.getFormaciones(this.formacionFiltro)
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        console.log(response)
          this.paginator.set(response.paginator);
        this.formaciones = response.content as Formacion[];
        this.lformacion = true;
        this.actualizarCargador();
      });


    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 310, 0, 0))
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


  }

  ngOnInit(): void {
  }

  filtroInicio() {
    this.formacionFiltro.ordenCriterio = 'orden';
    this.formacionFiltro.ordenTipo = 'asc';
    this.formacionFiltro.parametro = 'nombre';
    this.formacionFiltro.valor = '';
    this.formacionFiltro.idEstado = 0;
    this.formacionFiltro.idPtipo = 0;
    this.formacionFiltro.idPdestacado = 0;
    this.formacionFiltro.pagina = 1;
    this.formacionFiltro.registros = 10;

  }

  restablecer() {
    this.loading = true;
    localStorage.removeItem("rnpm.admin.filtroFormacion");
    this.filtroInicio();
    this.formacionService.getFormaciones(this.formacionFiltro)
      .pipe(
        tap(response => { })
      ).subscribe(response => {
          this.paginator.set(response.paginator);
        this.formaciones = response.content as Formacion[];
        this.loading = false;
      });
  }

  actualizarPaginacion(evento: any): void {
    this.loading = true;
    localStorage.setItem("rnpm.admin.filtroFormacion", JSON.stringify(this.formacionFiltro));
    this.formacionService.getFormaciones(this.formacionFiltro)
      .pipe(
        tap(response => { })
      ).subscribe(response => {
          this.paginator.set(response.paginator);
        this.formaciones = response.content as Formacion[];
        this.loading = false;
      });
  }
  cambiarPagina(pagina: any) {
    this.loading = true;
    this.formacionFiltro.pagina = pagina;
    localStorage.setItem("rnpm.admin.filtroFormacion", JSON.stringify(this.formacionFiltro));
    this.formacionService.getFormaciones(this.formacionFiltro)
      .pipe(
        tap(response => { })
      ).subscribe(response => {
          this.paginator.set(response.paginator);
        this.formaciones = response.content as Formacion[];
        this.loading = false;
      });
  }

  actualizar(): void {
    this.loading = true;
    localStorage.setItem("rnpm.admin.filtroFormacion", JSON.stringify(this.formacionFiltro));
    this.formacionService.getFormaciones(this.formacionFiltro)
      .pipe(
        tap(response => { })
      ).subscribe(response => {
          this.paginator.set(response.paginator);
        this.formaciones = response.content as Formacion[];
        this.loading = false;
      });
  }

  eliminar(formacion: Formacion): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: 'Eliminar proyecto!',
      text: `¿Seguro que desea eliminar el proyecto "${formacion.nombre}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',

      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.formacionService.formacionEliminar(formacion.idFormacion).subscribe(
          () => {
            this.formaciones = this.formaciones.filter(cli => cli !== formacion)
            Swal.fire(
              'Proyecto eliminado!',
              `El proyecto "${formacion.nombre}" se eliminó con éxito.`,
              'success'
            )
          }
        )

      }
    });
  }

  actualizarCargador() {
    this.loading = (this.lformacion && this.lestados) ? false : true;
  }
}
