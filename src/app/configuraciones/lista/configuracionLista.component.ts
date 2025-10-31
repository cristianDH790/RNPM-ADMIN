import { Component, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { ConfiguracionFiltro } from '../../core/filter/configuracionFiltro';



import { AuthService } from '../../core/service/auth.service';
import { Parametro } from '../../core/model/parametro';
import { Configuracion } from '../../core/model/configuracion';
import { ParametroFiltro } from '../../core/filter/parametroFiltro';
import { RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxLoadingComponent, NgxLoadingModule } from 'ngx-loading';
import { faArrowLeft, faNewspaper, faPencil, faRefresh, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Paginator } from '../../core/util/paginator';
import { ParametroService } from '../../core/service/parametro.service';
import { ConfiguracionService } from '../../core/service/configuracion.service';


@Component({
  templateUrl: './configuracionLista.component.html',
  providers: [ConfiguracionService,ParametroService, AuthService],
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, NgbModule, NgxLoadingModule, FontAwesomeModule]
})
export class ConfiguracionListaComponent {

  public paginator = signal<Paginator | null>(null);

  /*Font Awesome Iconos*/
  faTrash = faTrash;
  faPencil = faPencil;
  faSearch = faSearch;
  faRefresh = faRefresh;
  faNewspaper = faNewspaper;
  faArrowLeft = faArrowLeft;
  /*Fin Font Awesome Iconos*/

  //Init
  configuracionFiltro: ConfiguracionFiltro = new ConfiguracionFiltro('', '', '', '', 0, 0, 0);

  //Array data
  ptipos: Parametro[];
  configuraciones: Configuracion[];

  //Cargadores
  loading: boolean = true;
  lconfiguraciones: boolean = false;
  lptipos: boolean = false;

  constructor(

     private configuracionService: ConfiguracionService,
    private parametroService: ParametroService,
    public authService: AuthService) {

    this.configuraciones = new Array() as Array<Configuracion>;
    this.ptipos = new Array() as Array<Parametro>;

    const filtroConfiguracion = localStorage.getItem("Yhassir.admin.filtroConfiguracion");

    filtroConfiguracion ? this.configuracionFiltro = JSON.parse(filtroConfiguracion) : this.filtroInicio();

    this.parametroService.getParametros(new ParametroFiltro('', '', '', '', 104, 292, 0, 0))
      .pipe().subscribe(response => {
        this.ptipos = response.content as Parametro[];
        this.lptipos = true;
        this.actualizarCargador();
      });

    this.getConfiguraciones();
  }

  eliminar(configuracion: Configuracion): void {
    Swal.fire({
      title: 'Eliminar configuración!',
      text: `¿Seguro que desea eliminar la configuración "${configuracion.nombre}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.configuracionService.configuracionEliminar(configuracion.idConfiguracion).subscribe(
          () => {
            this.configuraciones = this.configuraciones.filter(cat => cat !== configuracion)
            Swal.fire(
              'Configuración eliminada!',
              `La configuración "${configuracion.nombre}" se eliminó con éxito.`,
              'success'
            )
          }
        )

      }
    });
  }

  filtroInicio() {
    this.configuracionFiltro.ordenCriterio = 'idConfiguracion';
    this.configuracionFiltro.ordenTipo = 'asc';
    this.configuracionFiltro.parametro = 'nombre';
    this.configuracionFiltro.valor = '';
    this.configuracionFiltro.idPtipo = 0;
    this.configuracionFiltro.pagina = 0;
    this.configuracionFiltro.registros = 0;
  }

  restablecer() {
    localStorage.removeItem("Yhassir.admin.filtroConfiguracion");
    this.filtroInicio();
    this.getConfiguraciones();
  }

  actualizarPaginacion(): void {
    this.configuracionFiltro.pagina = 1;
    this.getConfiguraciones();

  }
  cambiarPagina(pagina: number) {
    this.configuracionFiltro.pagina = pagina;
    this.getConfiguraciones();
  }

  actualizar(): void {
    this.getConfiguraciones();
  }



  private getConfiguraciones() {
    this.loading = true;
    localStorage.setItem("Yhassir.admin.filtroConfiguracion", JSON.stringify(this.configuracionFiltro));
    this.configuracionService.getConfiguraciones(this.configuracionFiltro)
      .pipe().subscribe(response => {
         this.paginator.set(response.paginator);
        this.configuraciones = response.content as Configuracion[];
        this.lconfiguraciones = true;
        this.actualizarCargador();
      });
  }

  actualizarCargador() {
    this.loading = (this.lptipos && this.lconfiguraciones) ? false : true;
  }
}
