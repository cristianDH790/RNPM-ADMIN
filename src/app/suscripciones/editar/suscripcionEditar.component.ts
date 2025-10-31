import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

import { Suscripcion } from '../../core/model/suscripcion';
import { Tipo } from '../../core/model/tipo';





import { Estado } from '../../core/model/estado';
import { EstadoFiltro } from '../../core/filter/estadoFiltro';
import { AuthService } from '../../core/service/auth.service';
import { Validacion } from '../../core/util/validacion';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxLoadingModule } from 'ngx-loading';
import { faArrowLeft, faList, faPencil, faRefresh, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SuscripcionService } from '../../core/service/suscripcion.service';
import { EstadoService } from '../../core/service/estado.service';



@Component({
  selector: 'app-suscripcionEditar',
  imports: [FontAwesomeModule, RouterLink, CommonModule, FormsModule, ReactiveFormsModule, AngularEditorModule, NgxLoadingModule],
  standalone: true,
  templateUrl: './suscripcionEditar.component.html',
  providers: [AuthService,EstadoService ,SuscripcionService]
})
export class SuscripcionEditarComponent {


  faTrash = faTrash;
  faPencil = faPencil;
  faSearch = faSearch;
  faRefresh = faRefresh;
  faList = faList;
  faArrowLeft = faArrowLeft;

  suscripcion: Suscripcion = new Suscripcion();
  tipos!: Tipo[];
  estados!: Estado[];

  titulo: string = "Nueva suscripción";
  errores!: Validacion[];

  loading: boolean = true;
  lsuscripcion: boolean = false;
  lestados: boolean = false;
  constructor(
    private router: Router,

    private suscripcionService: SuscripcionService,
    private estadoService: EstadoService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = + params.get('id')!;
      if (id) {
        this.suscripcionService.getSuscripcion(id).subscribe((suscripcion) => {
          this.suscripcion = suscripcion
          this.titulo = "Editar suscripción";
        }, err => {
          this.errores = err as Validacion[];
          Swal.fire('Error', `${err.error.mensaje}`, 'error');
          this.router.navigate(['/suscripciones/lista']);
        });

      } else {
        this.suscripcion.correo = "";

        this.suscripcion.estado = new Estado();
        this.suscripcion.estado.idEstado = 387;
      }
      this.lsuscripcion = true;
      this.actualizarCargador();
    });




    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 321, 0, 0))
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.estados = response.content as Estado[];
        this.lestados = true;
        this.actualizarCargador();
      });

  }

  guardar(): void {
    console.log("Guardar: " + this.suscripcion.idSuscripcion);

    if (this.suscripcion.idSuscripcion === undefined) {
      console.log("Nuevo");
      this.suscripcionService.suscripcionGuardar(this.suscripcion)
        .subscribe(
          suscripcion => {
            this.router.navigate(['/suscripciones/lista']);
            Swal.fire('Nueva suscripción', `La suscripción de "${suscripcion.correo}" ha sido creada con éxito`, 'success');
          },
          err => {
            this.errores = err.error.errors as Validacion[];
            console.error('Código del error desde el backend: ' + err.status);
            console.error(err.error.errors);
          }
        );

    } else {
      console.log("Actualizar");
      this.suscripcionService.suscripcionActualizar(this.suscripcion)
        .subscribe(
          suscripcion => {
            this.router.navigate(['/suscripciones/lista']);
            Swal.fire('Suscripción actualizada', `La suscripción de "${suscripcion.correo}" ha sido actualizada con éxito`, 'success');
          },
          err => {
            this.errores = err.error.errors as Validacion[];
            console.error('Código del error desde el backend: ' + err.status);
            console.error(err.error.errors);
          }
        )
    }
  }

  //comparadores


  compararEstado(o1: Estado, o2: Estado): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idEstado === o2.idEstado;
  }

  actualizarCargador() {
    this.loading = (this.lestados && this.lsuscripcion) ? false : true;
  }


  validarError(campo: string, r: number): string {
    let respuesta = "";

    if (this.errores) {
      this.errores.forEach(e => {
        if (e.campo == campo) {
          if (r == 1)
            respuesta = "error";
          else
            respuesta = "(" + e.valor + ")";
        }
      });
    }
    return respuesta;
  }

}
