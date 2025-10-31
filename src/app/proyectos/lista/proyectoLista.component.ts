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
import { ProyectoService } from '../../core/service/proyecto.service';
import { EstadoService } from '../../core/service/estado.service';

@Component({
  templateUrl: './proyectoLista.component.html',
  providers: [ProyectoService,EstadoService, AuthService],
  standalone: true,
  styleUrls: ['./proyectoLista.component.css'],
  imports: [NgbModule,FontAwesomeModule, RouterModule, PaginatorComponent, RouterLink, CommonModule, FormsModule, NgxLoadingModule]
})
export class ProyectoListaComponent {

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
  proyectoFiltro: ProyectoFiltro = new ProyectoFiltro('', '', '', '',0, 0, 0, 0);

  estados: Estado[];
  proyectos: Proyecto[];

  paginador: any;

  loading: boolean = true;
  lestados: boolean = false;
  lproyectos: boolean = false;

  constructor(
    private proyectoService: ProyectoService,

    private estadoService: EstadoService,
  ) {
    this.proyectos = new Array() as Array<Proyecto>;
    this.estados = new Array() as Array<Estado>;

    if (localStorage.getItem("espectroProducciones.admin.filtroProyecto") != null) {
      this.proyectoFiltro = JSON.parse(localStorage.getItem("espectroProducciones.admin.filtroProyecto")!);
    } else {
      this.filtroInicio();
    }

    this.proyectoService.getProyectos(this.proyectoFiltro)
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        console.log(response)
        this.paginador = response.paginator;
        this.proyectos = response.content as Proyecto[];
        this.lproyectos = true;
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

  }

  ngOnInit(): void {
  }

  filtroInicio() {
    this.proyectoFiltro.ordenCriterio = 'orden';
    this.proyectoFiltro.ordenTipo = 'asc';
    this.proyectoFiltro.parametro = 'nombre';
    this.proyectoFiltro.valor = '';
    this.proyectoFiltro.idEstado = 0;
    this.proyectoFiltro.idPcategoria = 0;
    this.proyectoFiltro.pagina = 1;
    this.proyectoFiltro.registros = 10;

  }

  restablecer() {
    this.loading = true;
    localStorage.removeItem("espectroProducciones.admin.filtroProyecto");
    this.filtroInicio();
    this.proyectoService.getProyectos(this.proyectoFiltro)
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.paginador = response.paginator;
        this.proyectos = response.content as Proyecto[];
        this.loading = false;
      });
  }

  actualizarPaginacion(evento: any): void {
    this.loading = true;
    localStorage.setItem("espectroProducciones.admin.filtroProyecto", JSON.stringify(this.proyectoFiltro));
    this.proyectoService.getProyectos(this.proyectoFiltro)
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.paginador = response.paginator;
        this.proyectos = response.content as Proyecto[];
        this.loading = false;
      });
  }
  cambiarPagina(pagina: any) {
    this.loading = true;
    this.proyectoFiltro.pagina = pagina;
    localStorage.setItem("espectroProducciones.admin.filtroProyecto", JSON.stringify(this.proyectoFiltro));
    this.proyectoService.getProyectos(this.proyectoFiltro)
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.paginador = response.paginator;
        this.proyectos = response.content as Proyecto[];
        this.loading = false;
      });
  }

  actualizar(): void {
    this.loading = true;
    localStorage.setItem("espectroProducciones.admin.filtroProyecto", JSON.stringify(this.proyectoFiltro));
    this.proyectoService.getProyectos(this.proyectoFiltro)
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.paginador = response.paginator;
        this.proyectos = response.content as Proyecto[];
        this.loading = false;
      });
  }

  eliminar(proyecto: Proyecto): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: 'Eliminar proyecto!',
      text: `¿Seguro que desea eliminar el proyecto "${proyecto.nombre}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',

      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.proyectoService.proyectoEliminar(proyecto.idProyecto).subscribe(
          () => {
            this.proyectos = this.proyectos.filter(cli => cli !== proyecto)
            Swal.fire(
              'Proyecto eliminado!',
              `El proyecto "${proyecto.nombre}" se eliminó con éxito.`,
              'success'
            )
          }
        )

      }
    });
  }

  actualizarCargador() {
    this.loading = (this.lproyectos && this.lestados) ? false : true;
  }
}
