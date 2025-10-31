import { Component, EventEmitter, Input, Output } from '@angular/core';

// import { AuthService } from 'src/app/core/service/auth.service';
// import { CoreService } from 'src/app/core/service/core.service';
import Swal from 'sweetalert2';
import { RouteInfo } from './vertical-sidebar.metadata';
import { VerticalSidebarService } from './vertical-sidebar.service';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';



@Component({
  selector: 'app-vertical-sidebar',
  templateUrl: './vertical-sidebar.component.html',

  standalone:true
})
export class VerticalSidebarComponent {
  @Input() showClass: boolean = false;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();
  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: RouteInfo[] = [];
  path = '';

  constructor(private menuServise: VerticalSidebarService, private router: Router,
    // public coreService: CoreService,public authService: AuthService) {
    // this.menuServise.items.subscribe(menuItems => {
    //   this.sidebarnavItems = menuItems;

    //   // Active menu
    //   this.sidebarnavItems.filter(m => m.submenu.filter(
    //     (s) => {
    //       if (s.path === this.router.url) {
    //         this.path = m.title;
    //       }
    //     }
    //   ));
    //   this.addExpandClass(this.path);
    // });
  ) { }


  // logout(): void {
  //   Swal.fire('Logout', `Hola ${this.authService.usuario.login} has cerrado sesión con éxito!`, 'success');
  //   this.authService.logout();
  //   this.router.navigate(['/authentication/login']);
  // }


  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  handleNotify() {
    this.notify.emit(!this.showClass);
  }


}
