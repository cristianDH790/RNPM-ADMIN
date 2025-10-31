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

import { Parametro } from '../../core/model/parametro';
import { URL_IMAGE } from '../../config/config';

import { Boletin } from '../../core/model/boletin';
import { BoletinFiltro } from '../../core/filter/boletinFiltro';
import { BoletinService } from '../../core/service/boletin.service';
import { EstadoService } from '../../core/service/estado.service';

@Component({
  templateUrl: './boletinLista.component.html',
  styleUrls: ['./boletinLista.component.css'],
  providers: [EstadoService, BoletinService, AuthService],
  standalone: true,
  imports: [NgbModule, FontAwesomeModule, RouterLink, CommonModule, FormsModule, NgxLoadingModule, PaginatorComponent]
})

export class BoletinListaComponent {

  public paginator = signal<Paginator | null>(null);
  urlImage = URL_IMAGE;
  /*Inicio Font Awesome iconos*/
  faArrowLeft = faArrowLeft;
  faTrash = faTrash;
  faPencil = faPencil;
  faSearch = faSearch;
  faRefresh = faRefresh;
  faList = faList;

  boletinFiltro: BoletinFiltro = new BoletinFiltro('', '', '', '', 0, 0, 0,);

  //Array datos
  mensajes: MensajeEstado[];
  usuarios: Usuario[];
  boletines: Boletin[];
  estados: Estado[];
  perfiles: Perfil[];
  pdestacados!: Parametro[];
  ptipos!: Parametro[];
  lboletines: boolean = false;


  //Cargadores
  loading: boolean = true;

  lestados: boolean = false;

  paginador: any;

  constructor(
    private estadoService: EstadoService,
    private boletinService: BoletinService,

  ) {
    this.usuarios = new Array() as Array<Usuario>;
    this.estados = new Array() as Array<Estado>;
    this.perfiles = new Array() as Array<Perfil>;
    this.mensajes = new Array() as Array<MensajeEstado>;
    this.boletines = new Array() as Array<Boletin>;



    //Set filtro
    const filtroBoletinLocalStorage = localStorage.getItem("rnpm.admin.filtroBoletin");
    filtroBoletinLocalStorage ? this.boletinFiltro = JSON.parse(filtroBoletinLocalStorage!) : this.filtroInicio();

    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 332, 0, 0))
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




    //Get usuarios
    this.getBoletines();

  }

  filtroInicio() {
    this.boletinFiltro.ordenCriterio = 'fecha';
    this.boletinFiltro.ordenTipo = 'desc';
    this.boletinFiltro.parametro = 'nombre';
    this.boletinFiltro.valor = '';
    this.boletinFiltro.idEstado = 0;
    this.boletinFiltro.pagina = 1;
    this.boletinFiltro.registros = 10;

  }

  restablecer() {
    localStorage.removeItem("rnpm.admin.filtroBoletin");
    this.filtroInicio();
    this.getBoletines();
  }

  actualizarPaginacion(): void {
    this.boletinFiltro.pagina = 1;
    this.getBoletines();
  }

  cambiarPagina(pagina: any) {
    this.boletinFiltro.pagina = pagina;
    this.getBoletines();
  }

  actualizar(): void {
    this.loading = true;
    this.getBoletines();
  }

  eliminar(boletin: Boletin): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: 'Eliminar voletin!',
      text: `¿Seguro que desea eliminar el boletin "${boletin.nombre}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',

      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.boletinService.boletinEliminar(boletin.idBoletin).subscribe(
          () => {
            this.boletines = this.boletines.filter(cli => cli !== boletin)
            Swal.fire(
              'Boletin eliminada!',
              `La boletin "${boletin.nombre}" se eliminó con éxito.`,
              'success'
            )
          }
        )

      }
    });
  }

  private getBoletines() {
    this.loading = true;
    this.boletinService.getBoletines(this.boletinFiltro)
      .pipe().subscribe(response => {
         this.paginator.set(response.paginator);
        this.boletines = response.content as Boletin[];
        this.lboletines = true;
        this.actualizarCargador();
      });

  }

  actualizarCargador() {
    this.loading = (this.lboletines && this.lestados) ? false : true;
  }

}
