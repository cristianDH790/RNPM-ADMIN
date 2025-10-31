import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from '../../core/model/usuario';
import { Estado } from '../../core/model/estado';
import { Parametro } from '../../core/model/parametro';


import { EstadoFiltro } from '../../core/filter/estadoFiltro';
import { ParametroFiltro } from '../../core/filter/parametroFiltro';
import { Perfil } from '../../core/model/perfil';

import { Validacion } from '../../core/util/validacion';
import { PerfilFiltro } from '../../core/filter/perfilFiltro';
import { CommonModule } from '@angular/common';
import { NgxLoadingModule } from 'ngx-loading';
import { AuthService } from '../../core/service/auth.service';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PerfilService } from '../../core/service/perfil.service';
import { EstadoService } from '../../core/service/estado.service';
import { ParametroService } from '../../core/service/parametro.service';
import { UsuarioService } from '../../core/service/usuario.service';

@Component({
  selector: 'app-usuarioEditar',
  templateUrl: './usuarioEditar.component.html',
  styleUrls: ['./usuarioEditar.component.css'],
  providers: [ParametroService, EstadoService, PerfilService, UsuarioService, AuthService],
  imports: [FontAwesomeModule, RouterLink, CommonModule, FormsModule, NgxLoadingModule],
  standalone: true
})
export class UsuarioEditarComponent {

  /*Font Awesome Iconos*/
  faCheck = faCheck;
  faArrowLeft = faArrowLeft;

  //Init
  usuario: Usuario = new Usuario();
  titulo: string = "Nuevo usuario";

  //Array datos
  perfiles!: Perfil[];

  pdocumentos!: Parametro[];
  estados!: Estado[];
  errores!: Validacion[];

  //Cargadores
  lestados: boolean = false;
  lpdocumentos: boolean = false;
  lperfiles: boolean = false;
  lubigeos: boolean = false;
  lusuario: boolean = false;
  loading: boolean = true;

  constructor(
    private router: Router,

    private estadoService: EstadoService,
    private parametroService: ParametroService,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,

    private perfilService: PerfilService,
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = + params.get('id')!;
      if (id) {
        this.usuarioService.getUsuario(id).subscribe((usuario) => {
          this.titulo = "Edición de usuario";
          this.usuario = usuario;
          this.lusuario = true;
        });

      } else {
        this.usuario.estado = new Estado();
        this.usuario.perfil = new Perfil();
        this.usuario.pdocumento = new Parametro();

        this.usuario.nombres = "";
        this.usuario.pApellido = "";
        this.usuario.sApellido = "";
        this.usuario.sexo = "";
        this.usuario.documento = "";
        this.usuario.fechaNacimiento = null!;
        this.usuario.login = "";
        this.usuario.password = "";
        this.usuario.estado.idEstado = 110;
        this.usuario.perfil.idPerfil = 1;
        this.usuario.pdocumento.idParametro = 537;
        this.lusuario = true;
      }
    });

    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 300, 0, 0))
      .pipe().subscribe(response => {
        this.estados = response.content as Estado[];
        this.lestados = true;
        this.actualizarCargador();
      });

    this.parametroService.getParametros(new ParametroFiltro('', '', '', '', 104, 293, 0, 0))
      .pipe().subscribe(response => {
        this.pdocumentos = response.content as Parametro[];
        this.lpdocumentos = true;
        this.actualizarCargador();
      });


    this.perfilService.getPerfiles(new PerfilFiltro('', '', '', '', 0, 0, 0))
      .pipe().subscribe(response => {
        this.perfiles = response.content as Perfil[];
        this.lperfiles = true;
        this.actualizarCargador();
      });
  }

  guardar(): void {
    this.loading = true;

    const usuarioAccion = !this.usuario.idUsuario ?
      this.usuarioService.usuarioGuardar(this.usuario) : this.usuarioService.usuarioActualizar(this.usuario);

    usuarioAccion.subscribe(usuario => {
      this.router.navigate(['/usuarios/lista']);
      Swal.fire(`${this.usuario.idUsuario ? 'Actualizar' : 'Nuevo'} usuario`, `El usuario ${this.usuario.nombres} ${this.usuario.pApellido} ha sido ${this.usuario.idUsuario ? 'actualizado' : 'creado'} con éxito`, 'success');
      this.loading = false;
    },
      err => {
        this.errores = err.error.errors as Validacion[];
        this.loading = false;
      }
    );
  }

  //comparadores
  compararParametro(o1: Parametro, o2: Parametro): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idParametro === o2.idParametro;
  }
  compararEstado(o1: Estado, o2: Estado): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idEstado === o2.idEstado;
  }
  compararPerfil(o1: Perfil, o2: Perfil): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idPerfil === o2.idPerfil;
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

  keyup(event: any) {
    this.usuario.login = this.usuario.documento;
    this.usuario.password = this.usuario.documento;
  }

  actualizarCargador() {
    this.loading = (this.lestados && this.lusuario && this.lpdocumentos && this.lperfiles) ? false : true;
  }
}
