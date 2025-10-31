import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Estado } from '../../core/model/estado';
import { MensajeEstado } from '../../core/util/mensajeEstado';
import { UsuarioFiltro } from '../../core/filter/usuarioFiltro';
import { EstadoFiltro } from '../../core/filter/estadoFiltro';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Perfil } from '../../core/model/perfil';

import { Usuario } from '../../core/model/usuario';
import { FormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { AuthService } from '../../core/service/auth.service';
import { faArrowLeft, faList, faPencil, faRefresh, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Paginator } from '../../core/util/paginator';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { Noticia } from '../../core/model/noticia';
import { NoticiaFiltro } from '../../core/filter/noticiaFiltro';
import { ParametroFiltro } from '../../core/filter/parametroFiltro';
import { Parametro } from '../../core/model/parametro';
import { URL_IMAGE } from '../../config/config';
import { NoticiaService } from '../../core/service/noticia.service';
import { EstadoService } from '../../core/service/estado.service';
import { ParametroService } from '../../core/service/parametro.service';
import { UsuarioService } from '../../core/service/usuario.service';

@Component({
  templateUrl: './noticiaLista.component.html',
  styleUrls: ['./noticiaLista.component.css'],
  providers: [ ParametroService, EstadoService, UsuarioService, NoticiaService, AuthService],
  standalone: true,
  imports: [NgbModule, FontAwesomeModule, RouterLink, CommonModule, FormsModule, NgxLoadingModule, PaginatorComponent]
})

export class NoticiaListaComponent {

  public paginator = signal<Paginator | null>(null);
  paginador: any;
  urlImage = URL_IMAGE;
  /*Inicio Font Awesome iconos*/
  faArrowLeft = faArrowLeft;
  faTrash = faTrash;
  faPencil = faPencil;
  faSearch = faSearch;
  faRefresh = faRefresh;
  faList = faList;

  noticiaFiltro: NoticiaFiltro = new NoticiaFiltro('', '', '', '', 0, 0, 0, 0, 0, 0,);

  //Array datos
  mensajes: MensajeEstado[];
  usuarios: Usuario[];
  noticias: Noticia[];
  estados: Estado[];
  perfiles: Perfil[];
  pdestacados!: Parametro[];
  ptipos!: Parametro[];
  lnoticias: boolean = false;
  lpdestacados: boolean = false;
  lptipos: boolean = false;

  //Cargadores
  loading: boolean = true;
  lusuarios: boolean = false;
  lestados: boolean = false;
  lperfiles: boolean = false;
  lcuenta: boolean = false;


  constructor(

    private estadoService: EstadoService,
    private parametroService: ParametroService,
    private noticiaService: NoticiaService,
    private usuarioService: UsuarioService,
  ) {
    this.usuarios = new Array() as Array<Usuario>;
    this.estados = new Array() as Array<Estado>;
    this.perfiles = new Array() as Array<Perfil>;
    this.mensajes = new Array() as Array<MensajeEstado>;
    this.noticias = new Array() as Array<Noticia>;



    //Set filtro
    const filtroNoticiaLocalStorage = localStorage.getItem("Rnpm.admin.filtroNoticia");
    filtroNoticiaLocalStorage ? this.noticiaFiltro = JSON.parse(filtroNoticiaLocalStorage!) : this.filtroInicio();

    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 319, 0, 0))
      .pipe().subscribe(response => {
        this.estados = response.content as Estado[];
        this.lestados = true;
        this.actualizarCargador();
      });

    // this.coreService.getNoticias(this.noticiaFiltro)
    // .pipe().subscribe(response => {
    //   this.paginador = response.paginator;
    //   this.noticias = response.content as Noticia[];
    //   this.lnoticias = true;
    //   this.actualizarCargador();
    // });



    this.parametroService.getParametros(new ParametroFiltro('', '', '', '', 104, 314, 0, 0))
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.ptipos = response.content as Parametro[];
        this.lptipos = true;
        this.actualizarCargador();
      });

    // this.baseService.getParametros(new ParametroFiltro('', '', '', '', 104, 314, 0, 0))
    // .pipe(
    //     tap(response => { })
    // ).subscribe(response => {
    //     this.ptipos = response.content as Parametro[];
    //     this.lptipos = true;
    //     this.actualizarCargador();
    // });

    this.usuarioService.getUsuarios(new UsuarioFiltro('', '', '', '', 110, 0, 0, 0, 0))
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.usuarios = response.content as Usuario[];
        this.lusuarios = true;
        this.actualizarCargador();
      });


    //Get usuarios
    this.getNoticias();

  }

  filtroInicio() {
    this.noticiaFiltro.ordenCriterio = 'fechapublicacion';
    this.noticiaFiltro.ordenTipo = 'desc';
    this.noticiaFiltro.parametro = 'titulo';
    this.noticiaFiltro.valor = '';
    this.noticiaFiltro.idEstado = 0;
    this.noticiaFiltro.idUsuario = 0;
    this.noticiaFiltro.idPdestacado = 0;
    this.noticiaFiltro.pagina = 1;
    this.noticiaFiltro.registros = 10;

  }

  restablecer() {
    localStorage.removeItem("Rnpm.admin.filtroUsuario");
    this.filtroInicio();
    this.getNoticias();
  }

  actualizarPaginacion(): void {
    this.noticiaFiltro.pagina = 1;
    this.getNoticias();
  }

  cambiarPagina(pagina: any) {
    this.noticiaFiltro.pagina = pagina;
    this.getNoticias();
  }

  actualizar(): void {
    this.loading = true;
    this.getNoticias();
  }

  eliminar(noticia: Noticia): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: 'Eliminar noticia!',
      text: `¿Seguro que desea eliminar la noticia "${noticia.titulo}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',

      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.noticiaService.noticiaEliminar(noticia.idNoticia).subscribe(
          () => {
            this.noticias = this.noticias.filter(cli => cli !== noticia)
            Swal.fire(
              'Noticia eliminada!',
              `La noticia "${noticia.titulo}" se eliminó con éxito.`,
              'success'
            )
          }
        )

      }
    });
  }

  private getNoticias() {
    this.loading = true;
    this.noticiaService.getNoticias(this.noticiaFiltro)
      .pipe().subscribe(response => {
       this.paginator.set(response.paginator);
        this.noticias = response.content as Noticia[];
        this.lnoticias = true;
        this.actualizarCargador();
      });

  }

  actualizarCargador() {
    this.loading = (this.lnoticias && this.lestados && this.ptipos &&
      this.lusuarios) ? false : true;
  }

}
