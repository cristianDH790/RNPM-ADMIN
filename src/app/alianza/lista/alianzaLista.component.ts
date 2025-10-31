import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router';

import Swal from 'sweetalert2';
import { Estado } from '../../core/model/estado';
import { MensajeEstado } from '../../core/util/mensajeEstado';

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
import { AlianzaFiltro } from '../../core/filter/alianzaFiltro';
import { Alianza } from '../../core/model/alianza';
import { AlianzaService } from '../../core/service/alianza.service';
import { EstadoService } from '../../core/service/estado.service';

@Component({
  templateUrl: './alianzaLista.component.html',
  styleUrls: ['./alianzaLista.component.css'],
  providers: [EstadoService, AlianzaService, AuthService],
  standalone: true,
  imports: [NgbModule, FontAwesomeModule, RouterLink, CommonModule, FormsModule, NgxLoadingModule, PaginatorComponent]
})

export class AlianzaListaComponent {

  public paginator = signal<Paginator | null>(null);
  urlImage = URL_IMAGE;
  /*Inicio Font Awesome iconos*/
  faArrowLeft = faArrowLeft;
  faTrash = faTrash;
  faPencil = faPencil;
  faSearch = faSearch;
  faRefresh = faRefresh;
  faList = faList;

  alianzaFiltro: AlianzaFiltro = new AlianzaFiltro('', '', '', '', 0, 0, 0, );

  //Array datos
  mensajes: MensajeEstado[];
  usuarios: Usuario[];
  alianzas: Alianza[];
  estados: Estado[];
  perfiles: Perfil[];
  pdestacados!: Parametro[];
  ptipos!: Parametro[];
  lalianzas: boolean = false;


  //Cargadores
  loading: boolean = true;
  lusuarios: boolean = false;
  lestados: boolean = false;
  lperfiles: boolean = false;
  lcuenta: boolean = false;
  paginador: any;

  constructor(

    private estadoService: EstadoService,
    private alianzaService: AlianzaService,

  ) {
    this.usuarios = new Array() as Array<Usuario>;
    this.estados = new Array() as Array<Estado>;
    this.perfiles = new Array() as Array<Perfil>;
    this.mensajes = new Array() as Array<MensajeEstado>;
    this.alianzas = new Array() as Array<Alianza>;



    //Set filtro
    const filtroAlianzaLocalStorage = localStorage.getItem("rnpm.admin.filtroAlianza");
    filtroAlianzaLocalStorage ? this.alianzaFiltro = JSON.parse(filtroAlianzaLocalStorage!) : this.filtroInicio();

    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 331, 0, 0))
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
    this.getAlianzas();

  }

  filtroInicio(){
    this.alianzaFiltro.ordenCriterio = 'fecha';
    this.alianzaFiltro.ordenTipo = 'desc';
    this.alianzaFiltro.parametro = 'nombre';
    this.alianzaFiltro.valor = '';
    this.alianzaFiltro.idEstado = 0;
    this.alianzaFiltro.pagina = 1;
    this.alianzaFiltro.registros = 10;

  }

  restablecer() {
    localStorage.removeItem("rnpm.admin.filtroAlianza");
    this.filtroInicio();
    this.getAlianzas();
  }

  actualizarPaginacion(): void {
    this.alianzaFiltro.pagina = 1;
    this.getAlianzas();
  }

  cambiarPagina(pagina: any) {
    this.alianzaFiltro.pagina = pagina;
    this.getAlianzas();
  }

  actualizar(): void {
    this.loading = true;
    this.getAlianzas();
  }

  eliminar(alianza: Alianza): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: 'Eliminar alianza!',
      text: `¿Seguro que desea eliminar la alianza "${alianza.nombre}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',

      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.alianzaService.alianzaEliminar(alianza.idAlianza).subscribe(
          () => {
            this.alianzas = this.alianzas.filter(cli => cli !== alianza)
            Swal.fire(
              'Alianza eliminada!',
              `La alianza "${alianza.nombre}" se eliminó con éxito.`,
              'success'
            )
          }
        )

      }
    });
  }

  private getAlianzas() {
    this.loading = true;
    this.alianzaService.getAlianzas(this.alianzaFiltro)
    .pipe().subscribe(response => {
        this.paginator.set(response.paginator);
      this.alianzas = response.content as Alianza[];
      this.lalianzas = true;
      this.actualizarCargador();
    });

  }

  actualizarCargador() {
    this.loading = (this.lalianzas && this.lestados) ? false : true;
  }

}
