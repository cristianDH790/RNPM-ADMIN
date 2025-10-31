import { Component, signal } from '@angular/core';
import Swal from 'sweetalert2';

import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { ContenidoWebCategoriaFiltro } from '../../core/filter/contenidoWebCategoriaFiltro';
import { Estado } from '../../core/model/estado';
import { ContenidoWebCategoria } from '../../core/model/contenidoWebCategoria';
import { EstadoFiltro } from '../../core/filter/estadoFiltro';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { faArrowLeft, faCheck, faList, faPencil, faRefresh, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Paginator } from '../../core/util/paginator';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { ContenidoWebCategoriaService } from '../../core/service/contenidoWebCategorias.service';
import { EstadoService } from '../../core/service/estado.service';

@Component({
  templateUrl: './ContenidoWebCategoriaLista.component.html',
  providers: [EstadoService, ContenidoWebCategoriaService, AuthService],
  imports: [FontAwesomeModule, NgxLoadingModule, FormsModule, RouterLink, PaginatorComponent, CommonModule],
  standalone: true
})
export class ContenidoWebCategoriaListaComponent {

  public paginator = signal<Paginator | null>(null);

  /*Font Awesome Iconos*/
  faCheck = faCheck;
  faArrowLeft = faArrowLeft;
  faSearch = faSearch;
  faRefresh = faRefresh;
  faList = faList;
  faPencil = faPencil;
  faTrash = faTrash;

  //Init
  contenidoWebCategoriaFiltro: ContenidoWebCategoriaFiltro = new ContenidoWebCategoriaFiltro('', '', '', '', 0, 0, 0, 0);

  //Array data
  estados: Estado[];
  contenidoWebCategorias: ContenidoWebCategoria[];
  rcontenidoWebCategorias: ContenidoWebCategoria[];

  //Cargadores
  loading: boolean = true;
  lcontenidoWebCategorias: boolean = false;
  lestados: boolean = false;
  lrcontenidoWebCategorias: boolean = false;

  constructor(
    private contenidoWebCategoriaService: ContenidoWebCategoriaService,

    private estadoService: EstadoService,
    public authService: AuthService) {

    this.contenidoWebCategorias = new Array() as Array<ContenidoWebCategoria>;
    this.rcontenidoWebCategorias = new Array() as Array<ContenidoWebCategoria>;
    this.estados = new Array() as Array<Estado>;

    this.loading = true;

    const filtroContenidoWebCategoria = localStorage.getItem("Yhassir.admin.filtroContenidoWebCategoria");

    filtroContenidoWebCategoria ? this.contenidoWebCategoriaFiltro = JSON.parse(filtroContenidoWebCategoria) : this.filtroInicio();

    this.contenidoWebCategoriaService.getContenidoWebCategorias(new ContenidoWebCategoriaFiltro('', '', '', '', 0, 0, 0, 0))
      .pipe().subscribe(response => {
        this.rcontenidoWebCategorias = response.content as ContenidoWebCategoria[];
        this.lrcontenidoWebCategorias = true;
        this.actualizarCargador();
      });

    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 214, 0, 0))
      .pipe().subscribe(response => {
        this.estados = response.content as Estado[];
        this.lestados = true;
        this.actualizarCargador();
      });

    this.getContenidoWebCategorias();
  }

  //============= ACCIONES COTNENIDO WEB CATEGORÍA =============\\
  eliminar(contenidoWebCategoria: ContenidoWebCategoria): void {
    Swal.fire({
      title: 'Eliminar categoría de galeria!',
      text: `¿Seguro que desea eliminar categoría "${contenidoWebCategoria.nombre}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',

      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.contenidoWebCategoriaService.contenidoWebCategoriaEliminar(contenidoWebCategoria.idContenidoWebCategoria).subscribe(
          () => {
            this.contenidoWebCategorias = this.contenidoWebCategorias.filter(cat => cat !== contenidoWebCategoria)
            Swal.fire(
              'Categoría eliminada!',
              `La categoría "${contenidoWebCategoria.nombre}" se eliminó con éxito.`,
              'success'
            )
          }
        )
      }
    });
  }

  //============= PAGINACIÓN =============\\
  filtroInicio() {
    this.contenidoWebCategoriaFiltro.ordenCriterio = 'fecha';
    this.contenidoWebCategoriaFiltro.ordenTipo = 'desc';
    this.contenidoWebCategoriaFiltro.parametro = 'nombre';
    this.contenidoWebCategoriaFiltro.valor = '';
    this.contenidoWebCategoriaFiltro.idEstado = 0;
    this.contenidoWebCategoriaFiltro.idRcontenidoWebCategoria = 0;
    this.contenidoWebCategoriaFiltro.pagina = 1;
    this.contenidoWebCategoriaFiltro.registros = 10;
  }

  restablecer() {
    localStorage.removeItem("Yhassir.admin.filtroContenidoWebCategoria");
    this.filtroInicio();
    this.getContenidoWebCategorias();
  }

  actualizarPaginacion(): void {
    this.contenidoWebCategoriaFiltro.pagina = 1;
    this.getContenidoWebCategorias();

  }

  cambiarPagina(pagina: any) {
    this.contenidoWebCategoriaFiltro.pagina = pagina;
    this.getContenidoWebCategorias();
  }

  actualizar(): void {
    this.getContenidoWebCategorias();
  }

  //============= SET CONTENIDO CATEGORÍA =============\\

  private getContenidoWebCategorias() {
    this.loading = true;
    localStorage.setItem("Yhassir.admin.filtroContenidoWebCategoria", JSON.stringify(this.contenidoWebCategoriaFiltro));
    this.contenidoWebCategoriaService.getContenidoWebCategorias(this.contenidoWebCategoriaFiltro)
      .pipe().subscribe(response => {
        this.paginator.set(response.paginator);
        this.contenidoWebCategorias = response.content as ContenidoWebCategoria[];
        this.lcontenidoWebCategorias = true;
        this.actualizarCargador();
      });
  }

  //============= CARGADOR =============\\

  actualizarCargador() {
    this.loading = (this.lestados && this.lcontenidoWebCategorias && this.lrcontenidoWebCategorias) ? false : true;
  }

}
