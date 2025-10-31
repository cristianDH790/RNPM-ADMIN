import { Component, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MensajeFiltro } from '../../core/filter/mensajeFiltro';


import { AuthService } from '../../core/service/auth.service';
import { Estado } from '../../core/model/estado';
import { Clase } from '../../core/model/clase';
import { Mensaje } from '../../core/model/mensaje';
import { EstadoFiltro } from '../../core/filter/estadoFiltro';
import { ClaseFiltro } from '../../core/filter/claseFiltro';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { faArrowLeft, faNewspaper, faPencil, faRefresh, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { Paginator } from '../../core/util/paginator';
import { ClaseService } from '../../core/service/clase.service';
import { EstadoService } from '../../core/service/estado.service';
import { MensajeService } from '../../core/service/mensaje.service';

@Component({
  templateUrl: './mensajeLista.component.html',
  providers: [EstadoService,MensajeService, ClaseService,AuthService],
  standalone: true,
  imports: [FontAwesomeModule, NgbModule, PaginatorComponent, RouterLink, CommonModule, FormsModule, NgxLoadingModule]
})
export class MensajeListaComponent {

  public paginator = signal<Paginator | null>(null);

  /*Inicio Font Awesome iconos*/
  faTrash = faTrash;
  faPencil = faPencil;
  faSearch = faSearch;
  faRefresh = faRefresh;
  faArrowLeft = faArrowLeft;
  faNewspaper = faNewspaper;

  //Init
  mensajeFiltro: MensajeFiltro = new MensajeFiltro('', '', '', '', 0, 0, 0, 0);

  //Array data
  estados: Estado[];
  clases: Clase[];
  mensajes: Mensaje[];

  //Cargadores
  loading: boolean = true;
  lmensajes: boolean = false;
  lestados: boolean = false;
  lclases: boolean = false;

  constructor(

        private claseService: ClaseService,
         private mensajeService: MensajeService,
        private estadoService: EstadoService,
    public authService: AuthService) {

    this.mensajes = new Array() as Array<Mensaje>;
    this.estados = new Array() as Array<Estado>;
    this.clases = new Array() as Array<Clase>;

    const filtroMensajes = localStorage.getItem("Yhassir.admin.filtroMensajes");

    filtroMensajes ? this.mensajeFiltro = JSON.parse(filtroMensajes) : this.filtroInicio();

    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 100, 0, 0))
      .pipe().subscribe(response => {
        this.estados = response.content as Estado[];
        this.lestados = true;
        this.actualizarCargador();
      });

    this.claseService.getClases(new ClaseFiltro('', '', '', '', 0, 0, 0))
      .pipe().subscribe(response => {
        this.clases = response.content as Clase[];
        this.lclases = true;
        this.actualizarCargador();
      });

      this.getMensajes();
  }

  filtroInicio() {
    this.mensajeFiltro.ordenCriterio = 'idMensaje';
    this.mensajeFiltro.ordenTipo = 'asc';
    this.mensajeFiltro.parametro = 'nombre';
    this.mensajeFiltro.valor = '';
    this.mensajeFiltro.idEstado = 0;
    this.mensajeFiltro.idClase = 0;
    this.mensajeFiltro.pagina = 1;
    this.mensajeFiltro.registros = 10;
  }

  restablecer() {
    localStorage.removeItem("Yhassir.admin.filtroMensajes");
    this.filtroInicio();
    this.getMensajes();
  }

  actualizarPaginacion(): void {
    this.mensajeFiltro.pagina = 1;
    this.getMensajes();
  }

  cambiarPagina(pagina: any) {
    this.mensajeFiltro.pagina = pagina;
    this.getMensajes();
  }

  actualizar(): void {
    this.getMensajes();
  }

  eliminar(mensaje: Mensaje): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: 'Eliminar mensaje!',
      text: `¿Seguro que desea eliminar el mensaje "${mensaje.nombre}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.mensajeService.mensajeEliminar(mensaje.idMensaje).subscribe(
          () => {
            this.mensajes = this.mensajes.filter(cat => cat !== mensaje)
            Swal.fire(
              'Mensaje eliminado!',
              `El mensaje "${mensaje.nombre}" se eliminó con éxito.`,
              'success'
            )
          }
        )

      }
    });
  }

  private getMensajes() {
    this.loading = true;
    localStorage.setItem("Yhassir.admin.filtroMensajes", JSON.stringify(this.mensajeFiltro));
    this.mensajeService.getMensajes(this.mensajeFiltro)
      .pipe().subscribe(response => {
        this.paginator.set(response.paginator);
        this.mensajes = response.content as Mensaje[];
        this.lmensajes = true;
        this.actualizarCargador();
      });
  }

  actualizarCargador() {
    this.loading = (this.lestados && this.lclases && this.lmensajes) ? false : true;
  }
}
