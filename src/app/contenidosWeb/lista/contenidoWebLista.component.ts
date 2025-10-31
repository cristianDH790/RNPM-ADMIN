import { Component, signal } from '@angular/core';
import Swal from 'sweetalert2';
import { ContenidoWebFiltro } from '../../core/filter/contenidoWebFiltro';

import { AuthService } from '../../core/service/auth.service';
import { Estado } from '../../core/model/estado';
import { Parametro } from '../../core/model/parametro';
import { ContenidoWeb } from '../../core/model/contenidoWeb';
import { EstadoFiltro } from '../../core/filter/estadoFiltro';
import { ParametroFiltro } from '../../core/filter/parametroFiltro';
import { NgxLoadingModule } from 'ngx-loading';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContenidoWebCategoria } from '../../core/model/contenidoWebCategoria';
import { faArrowLeft, faList, faNewspaper, faPencil, faRefresh, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ContenidoWebCategoriaFiltro } from '../../core/filter/contenidoWebCategoriaFiltro';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { Paginator } from '../../core/util/paginator';
import { ContenidoWebCategoriaService } from '../../core/service/contenidoWebCategorias.service';
import { ContenidoWebService } from '../../core/service/contenidoWeb.service';
import { EstadoService } from '../../core/service/estado.service';
import { ParametroService } from '../../core/service/parametro.service';

@Component({
  templateUrl: './contenidoWebLista.component.html',
  providers: [EstadoService, ContenidoWebService,ParametroService, AuthService,ContenidoWebCategoriaService],
  standalone: true,
  imports: [FontAwesomeModule, NgxLoadingModule, FormsModule, RouterLink, PaginatorComponent, CommonModule]
})
export class ContenidoWebListaComponent {

  public paginator = signal<Paginator | null>(null);

  /*Font aweson iconos */
  faList = faList;
  faSearch = faSearch;
  faRefresh = faRefresh;
  faArrowLeft = faArrowLeft;
  faTrash = faTrash;
  faPencil = faPencil;

  contenidoWebFiltro: ContenidoWebFiltro = new ContenidoWebFiltro('', '', '', '', 0, 0, 0, 0, 0);

  estados: Estado[];
  ptipos: Parametro[];
  categorias: ContenidoWebCategoria[];
  contenidosWeb: ContenidoWeb[];

  //Cargadores
  loading: boolean = true;
  lcontenidosWeb: boolean = false;
  lestados: boolean = false;
  lptipos: boolean = false;
  lcategorias: boolean = false;

  constructor(
    private contenidoWebService: ContenidoWebService,
    private contenidoWebCategoriaService: ContenidoWebCategoriaService,

     private parametroService: ParametroService,
    private estadoService: EstadoService,
    public authService: AuthService) {

    this.contenidosWeb = new Array() as Array<ContenidoWeb>;
    this.estados = new Array() as Array<Estado>;
    this.categorias = new Array() as Array<ContenidoWebCategoria>;
    this.ptipos = new Array() as Array<Parametro>;

    const contenidoWebCategoriaFiltro = localStorage.getItem("Yhassir.admin.filtroContenidoWeb");

    contenidoWebCategoriaFiltro ? this.contenidoWebFiltro = JSON.parse(contenidoWebCategoriaFiltro) : this.filtroInicio();

    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 213, 0, 0))
      .pipe().subscribe(response => {
        this.estados = response.content as Estado[];
        this.lestados = true;
        this.actualizarCargador();
      });
    this.parametroService.getParametros(new ParametroFiltro('', '', '', '', 104, 305, 0, 0))
      .pipe().subscribe(response => {
        this.ptipos = response.content as Parametro[];
        this.lptipos = true;
        this.actualizarCargador();
      });

    this.contenidoWebCategoriaService.getContenidoWebCategorias(new ContenidoWebCategoriaFiltro('', '', '', '', 0, 0, 0, 0))
      .pipe().subscribe(response => {
        this.categorias = response.content as ContenidoWebCategoria[];
        this.lcategorias = true;
        this.actualizarCargador();
      });

    this.getContenidosWeb();
  }

  filtroInicio() {
    this.contenidoWebFiltro.ordenCriterio = 'fecha';
    this.contenidoWebFiltro.ordenTipo = 'desc';
    this.contenidoWebFiltro.parametro = 'nombre';
    this.contenidoWebFiltro.valor = '';
    this.contenidoWebFiltro.idEstado = 0;
    this.contenidoWebFiltro.idContenidoWebCategoria = 0;
    this.contenidoWebFiltro.idPtipo = 0;
    this.contenidoWebFiltro.pagina = 1;
    this.contenidoWebFiltro.registros = 10;
  }

  restablecer() {
    localStorage.removeItem("Yhassir.admin.filtroContenidoWeb");
    this.filtroInicio();
    this.getContenidosWeb();
  }

  actualizarPaginacion(): void {
    this.contenidoWebFiltro.pagina = 1;
    this.getContenidosWeb();
  }

  cambiarPagina(pagina: any) {
    this.contenidoWebFiltro.pagina = pagina;
    this.getContenidosWeb();
  }

  actualizar(): void {
    this.getContenidosWeb();
  }

  eliminar(contenidoWeb: ContenidoWeb): void {
    Swal.fire({
      title: 'Eliminar contenido Web!',
      text: `¿Seguro que desea eliminar el contenido web "${contenidoWeb.nombre}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.contenidoWebService.contenidoWebEliminar(contenidoWeb.idContenidoWeb).subscribe(
          () => {
            this.contenidosWeb = this.contenidosWeb.filter(cat => cat !== contenidoWeb)
            Swal.fire(
              'Contenido eliminado!',
              `El contenido "${contenidoWeb.nombre}" se eliminó con éxito.`,
              'success'
            );
            this.loading = false;
          }
        )
      }
    });
  }

  private getContenidosWeb() {
    this.loading = true;
    localStorage.setItem("Yhassir.admin.filtroContenidoWeb", JSON.stringify(this.contenidoWebFiltro));
    this.contenidoWebService.getContenidosWeb(this.contenidoWebFiltro)
      .pipe().subscribe(response => {
        this.paginator.set(response.paginator);
        this.contenidosWeb = response.content as ContenidoWeb[];
        this.lcontenidosWeb = true;
        this.actualizarCargador();
      });

  }

  actualizarCargador() {
    this.loading = (this.lestados && this.lcategorias && this.lcontenidosWeb && this.lptipos) ? false : true;
  }

}
