import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Usuario } from '../../core/model/usuario';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../core/service/auth.service';
import Swal from 'sweetalert2';
import { NgxLoadingModule } from 'ngx-loading';
import { UsuarioService } from '../../core/service/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  providers: [UsuarioService, AuthService],
  imports: [NgClass, FormsModule, CommonModule,NgxLoadingModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public usuario: Usuario;
  public login: string;
  public loading: boolean;


  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    public authService: AuthService
  ) {
    this.usuario = new Usuario();
    this.login = "";
    this.loading = false;
  }

  loginform = true;
  recoverform = false;


  ngOnInit() {
  }

  iniciarSesion(): void {
    if (this.usuario.login == null || this.usuario.password == null) {
      Swal.fire('Error de inicio de sesión', 'Usuario o contraseña vacias!', 'error');
      return;
    }
    this.loading = true;
    this.authService.login(this.usuario).subscribe(response => {
      if (response.status != 'error') {

        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);

        let usuario = this.authService.usuario;

        Swal.fire('Inicio de sesión', `Hola ${usuario.nombres} ${usuario.pApellido}, has iniciado sesión con éxito!`, 'success');

        this.router.navigate(['/dashboard/inicio']);

      } else {
        this.loading = false;
        Swal.fire('Error', response.mensaje, 'error');
      }


    }, err => {
      this.loading = false;
      if (err.status == 400) {
        console.log(err);
        Swal.fire('Error de inicio de sesión', 'Usuario o contraseña incorrecta!', 'error');
      }

      if (err.status == 401) {
        Swal.fire('Error de inicio de sesión', 'Se ha presentado un problema de inicio de sesión. Cierre el navegador e intentelo nuevamente', 'error');
        this.login = "";
        return;
      }
    }
    );
  }

  recuperarClaveForm() {
    //console.log("RECUPERAR CONTRASEÑA: " + this.login);
    if (this.usuario.login == null || this.usuario.login == "") {
      Swal.fire('Recuperar contraseña', 'Ingrese su nombre de usuario!.', 'error');
      return;
    } else {
      this.loading = true;
      this.usuarioService.usuarioRecuperarClave(this.usuario.login).subscribe(response => {
        Swal.fire('Recuperar contraseña', `La recuperación de su contraseña se realizó con éxito. En breve recibirá un correo con una contraseña nueva!.`, 'success');
        this.loading = false;
      }, err => {
        this.loading = false;
        console.log(err);
        if (err.status == 404) {
          Swal.fire('Recuperar contraseña', `El usuario "${this.usuario.login}" no existe en el sistema.`, 'error');
          this.login = "";
          return;
        }

        if (err.status == 406) {
          Swal.fire('Recuperar contraseña', `El usuario "${this.usuario.login}" cuenta con un correo inválido.`, 'error');
          this.login = "";
          return;
        }
        this.loading = false;
      }
      );
      this.recoverform = !this.recoverform;
    }
  }

  showRecoverForm() {
    this.loginform = !this.loginform;
    this.recoverform = !this.recoverform;
  }
}
