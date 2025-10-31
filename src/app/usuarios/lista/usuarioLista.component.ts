import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Estado } from '../../core/model/estado';
import { MensajeEstado } from '../../core/util/mensajeEstado';
import { UsuarioFiltro } from '../../core/filter/usuarioFiltro';
import { EstadoFiltro } from '../../core/filter/estadoFiltro';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Perfil } from '../../core/model/perfil';

import { Usuario } from '../../core/model/usuario';
import { PerfilFiltro } from '../../core/filter/perfilFiltro';
import { FormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { AuthService } from '../../core/service/auth.service';
import { faArrowLeft, faList, faPencil, faRefresh, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Paginator } from '../../core/util/paginator';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { PerfilService } from '../../core/service/perfil.service';
import { EstadoService } from '../../core/service/estado.service';
import { UsuarioService } from '../../core/service/usuario.service';

@Component({
  templateUrl: './usuarioLista.component.html',
  styleUrls: ['./usuarioLista.component.css'],
  providers: [EstadoService, UsuarioService, AuthService, PerfilService],
  standalone: true,
  imports: [NgbModule, FontAwesomeModule, RouterLink, CommonModule, FormsModule, NgxLoadingModule, PaginatorComponent]
})

export class UsuarioListaComponent {

  public paginator = signal<Paginator | null>(null);
  paginador: any;
  /*Inicio Font Awesome iconos*/
  faArrowLeft = faArrowLeft;
  faTrash = faTrash;
  faPencil = faPencil;
  faSearch = faSearch;
  faRefresh = faRefresh;
  faList = faList;

  usuarioFiltro: UsuarioFiltro = new UsuarioFiltro('', '', '', '', 0, 0, 0, 0, 0);

  //Array datos
  mensajes: MensajeEstado[];
  usuarios: Usuario[];
  estados: Estado[];
  perfiles: Perfil[];

  //Cargadores
  loading: boolean = true;
  lusuarios: boolean = false;
  lestados: boolean = false;
  lperfiles: boolean = false;
  lcuenta: boolean = false;

  constructor(

    private estadoService: EstadoService,
    private usuarioService: UsuarioService,

    private perfilService: PerfilService,

  ) {
    this.usuarios = new Array() as Array<Usuario>;
    this.estados = new Array() as Array<Estado>;
    this.perfiles = new Array() as Array<Perfil>;
    this.mensajes = new Array() as Array<MensajeEstado>;

    //Set filtro
    const filtroUsuarioLocalStorage = localStorage.getItem("rnpm.admin.filtroUsuario");
    filtroUsuarioLocalStorage ? this.usuarioFiltro = JSON.parse(filtroUsuarioLocalStorage!) : this.filtroInicio();

    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 300, 0, 0))
      .pipe().subscribe(response => {
        this.estados = response.content as Estado[];
        this.lestados = true;
        this.actualizarCargador();
      });

    this.perfilService.getPerfiles(new PerfilFiltro('', '', '', '', 0, 0, 0))
      .pipe().subscribe(response => {
        this.perfiles = response.content as Perfil[];
        this.lperfiles = true;
        this.actualizarCargador();
      });

    //Get usuarios
    this.getUsuarios();

  }

  filtroInicio() {
    this.usuarioFiltro.ordenCriterio = 'nombres';
    this.usuarioFiltro.ordenTipo = 'asc';
    this.usuarioFiltro.parametro = 'login';
    this.usuarioFiltro.valor = '';
    this.usuarioFiltro.idEstado = 0;
    this.usuarioFiltro.idPerfil = 0;
    this.usuarioFiltro.idUbigeo = 0;
    this.usuarioFiltro.pagina = 1;
    this.usuarioFiltro.registros = 10;
  }

  restablecer() {
    localStorage.removeItem("rnpm.admin.filtroUsuario");
    this.filtroInicio();
    this.getUsuarios();
  }

  actualizarPaginacion(): void {
    this.usuarioFiltro.pagina = 1;
    this.getUsuarios();
  }

  cambiarPagina(pagina: any) {
    this.usuarioFiltro.pagina = pagina;
    this.getUsuarios();
  }

  actualizar(): void {
    this.loading = true;
    this.getUsuarios();
  }

  eliminar(usuario: Usuario): void {
    Swal.fire({
      title: 'Eliminar usuario',
      text: `¿Seguro que desea eliminar a ${usuario.login}?`,
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
        this.usuarioService.usuarioEliminar(usuario.idUsuario).subscribe(
          () => {
            this.usuarios = this.usuarios.filter(usu => usu !== usuario)
            Swal.fire(
              'Usuario Eliminado!',
              `El usuario ${usuario.login}  se eliminó con éxito.`,
              'success'
            );
            this.loading = false;
          }
        )

      } else {
        Swal.fire(`Eliminar usuario`, `El usuario no se puede eliminar.`, 'info');
      }
    });
  }

  private getUsuarios() {
    this.loading = true;
    localStorage.setItem("rnpm.admin.filtroUsuario", JSON.stringify(this.usuarioFiltro));
    this.usuarioService.getUsuarios(this.usuarioFiltro)
      .pipe().subscribe(response => {
        this.paginator.set(response.paginator);
        this.usuarios = response.content as Usuario[];
        this.lusuarios = true;
        this.actualizarCargador();
      });
  }

  actualizarCargador() {
    this.loading = (this.lusuarios && this.lestados && this.lperfiles) ? false : true;
  }

}
