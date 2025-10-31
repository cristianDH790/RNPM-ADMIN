import { Component, signal } from '@angular/core';
import { SliderFiltro } from '../../core/filter/sliderFiltro';
import { Slider } from '../../core/model/slider';
import { URL_BACKEND, URL_IMAGE } from '../../config/config';
import { Parametro } from '../../core/model/parametro';
import { Estado } from '../../core/model/estado';
import { EstadoFiltro } from '../../core/filter/estadoFiltro';
import { ParametroFiltro } from '../../core/filter/parametroFiltro';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxLoadingModule } from 'ngx-loading';


import { AuthService } from '../../core/service/auth.service';
import { faArrowLeft, faList, faPencil, faRefresh, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { Paginator } from '../../core/util/paginator';
import { SliderService } from '../../core/service/slider.service';
import { EstadoService } from '../../core/service/estado.service';
import { ParametroService } from '../../core/service/parametro.service';

@Component({
  templateUrl: './sliderLista.component.html',
  providers: [SliderService,ParametroService,EstadoService, AuthService],
  standalone: true,
  styleUrls: ['./sliderLista.component.css'],
  imports: [NgbModule, FontAwesomeModule, RouterModule, PaginatorComponent, RouterLink, CommonModule, FormsModule, ReactiveFormsModule, AngularEditorModule, NgxLoadingModule]
})
export class SliderListaComponent {

  public paginator = signal<Paginator | null>(null);

  /*Font Awesome Iconos*/
  faTrash = faTrash;
  faPencil = faPencil;
  faSearch = faSearch;
  faRefresh = faRefresh;
  faList = faList;
  faArrowLeft = faArrowLeft;

  //Init
  urlBackEnd = URL_BACKEND;
  urlImage = URL_IMAGE;
  sliderFiltro: SliderFiltro = new SliderFiltro('', '', '', '', 0, 0, 0, 0);

  //Array data
  pcategorias: Parametro[] = [];
  estados: Estado[] = [];
  sliders: Slider[] = [];

  //Cargadores
  loading: boolean = true;
  lsliders: boolean = false;
  lestados: boolean = false;
  lcategorias: boolean = false;

  constructor(
    private sliderService: SliderService,

     private parametroService: ParametroService,
    private estadoService: EstadoService,
  ) {

    const filtroSlider = localStorage.getItem("rnpm.admin.filtroSlider");

    filtroSlider ? this.sliderFiltro = JSON.parse(filtroSlider) : this.filtroInicio();

    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 253, 0, 0))
      .pipe().subscribe(response => {
        this.estados = response.content as Estado[];
        this.lestados = true;
        this.actualizarCargador();
      });

    this.parametroService.getParametros(new ParametroFiltro('', '', '', '', 104, 281, 0, 0))
      .pipe().subscribe(response => {
        this.pcategorias = response.content as Parametro[];
        this.lcategorias = true;
        this.actualizarCargador();
      });

    this.getSliders();
  }

  filtroInicio() {
    this.sliderFiltro.ordenCriterio = 'orden';
    this.sliderFiltro.ordenTipo = 'asc';
    this.sliderFiltro.parametro = 'nombre';
    this.sliderFiltro.valor = '';
    this.sliderFiltro.idEstado = 0;
    this.sliderFiltro.idPcategoria = 0;
    this.sliderFiltro.pagina = 1;
    this.sliderFiltro.registros = 10;
  }

  restablecer() {
    this.filtroInicio();
    this.getSliders();

  }

  actualizarPaginacion(): void {
    this.sliderFiltro.pagina = 1;
    this.getSliders();
  }
  cambiarPagina(pagina: any) {
    this.sliderFiltro.pagina = pagina;
    this.getSliders();
  }

  actualizar(): void {
    this.getSliders();
  }

  eliminar(slider: Slider): void {
    Swal.fire({
      title: 'Eliminar slider!',
      text: `¿Seguro que desea eliminar el slider "${slider.nombre}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',

      reverseButtons: true
    }).then((result) => {
      this.loading = true;

      if (result.value) {
        this.sliderService.sliderEliminar(slider.idSlider).subscribe(
          () => {
            this.sliders = this.sliders.filter(cat => cat !== slider)
            Swal.fire(
              'Slider eliminado!',
              `El slider "${slider.nombre}" se eliminó con éxito.`,
              'success'
            )
            this.loading = false;
          }
        )

      } else {
        this.loading = false;

      }
    });
  }

  private getSliders() {
    this.loading = true;
    localStorage.setItem("rnpm.admin.filtroSlider", JSON.stringify(this.sliderFiltro));
    this.sliderService.getSliders(this.sliderFiltro)
      .pipe().subscribe(response => {
        this.paginator.set(response.paginator);
        this.sliders = response.content as Slider[];
        this.lsliders = true;
        this.actualizarCargador();
      });
  }

  actualizarCargador() {
    this.loading = (this.lsliders && this.lestados && this.lcategorias) ? false : true;
  }
}
