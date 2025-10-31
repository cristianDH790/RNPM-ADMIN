import { CommonModule, DOCUMENT } from "@angular/common";
import { Component, OnInit, HostListener, Inject } from "@angular/core";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { NgxLoadingModule } from "ngx-loading";
import { NgbDropdown, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { TranslateService, TranslateStore } from "@ngx-translate/core";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import Swal from "sweetalert2";
import { AuthService } from "../../core/service/auth.service";
import { Usuario } from "../../core/model/usuario";

@Component({
  selector: "app-full-layout",
  templateUrl: "./full.component.html",
  styleUrls: ["./full.component.scss"],
  imports: [NgbDropdown, RouterOutlet, RouterLink, CommonModule, FormsModule, ReactiveFormsModule, AngularEditorModule, NgxLoadingModule, NgbModule, BreadcrumbComponent],
  standalone: true,
  providers: [TranslateService, TranslateStore, NgbDropdown, AuthService]
})

export class FullComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};
  active = 1;
  usuario!: Usuario;

  loading: boolean = true;

  constructor(
    public router: Router,
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService
  ) {
    this.usuario = this.authService.usuario;
  }

  tabStatus = "justified";

  public isCollapsed = false;

  public innerWidth: any;
  public defaultSidebar: any;
  public showSettings = false;
  public showMobileMenu = false;
  public expandLogo = false;



  options = {
    theme: "light", // two possible values: light, dark
    dir: "ltr", // two possible values: ltr, rtl
    layout: "vertical", // two possible values: vertical, horizontal
    sidebartype: "overlay", // four possible values: full, iconbar, overlay, mini-sidebar
    sidebarpos: "fixed", // two possible values: fixed, absolute
    headerpos: "fixed", // two possible values: fixed, absolute
    boxed: "full", // two possible values: full, boxed
    navbarbg: "skin1", // six possible values: skin(1/2/3/4/5/6)
    sidebarbg: "skin6", // six possible values: skin(1/2/3/4/5/6)
    logobg: "skin1", // six possible values: skin(1/2/3/4/5/6)
  };

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  ngOnInit() {
    if (this.router.url === "/") {
      this.router.navigate(["/dashboard/classic"]);
    }
    this.defaultSidebar = this.options.sidebartype;
    this.handleSidebar();
    if (this.options.dir == 'rtl') {
      this.document.body.classList.add("rtl");
    }
  }

  rtlToggle() {
    this.document.body.classList.toggle("rtl");
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: string) {
    this.handleSidebar();
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    switch (this.defaultSidebar) {
      case "full":
      case "iconbar":
        if (this.innerWidth < 1170) {
          this.options.sidebartype = "mini-sidebar";
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      case "overlay":
        if (this.innerWidth < 767) {
          this.options.sidebartype = "mini-sidebar";
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  logout(): void {
    console.log("this.authService.usuario")
    console.log(this.authService.usuario)
    Swal.fire('Cerrar sesión', `Hola ${this.authService.usuario.login} has cerrado sesión con éxito!`, 'success');
    this.authService.logout();
    this.router.navigate(['/authentication/login']);
  }

  toggleSidebarType() {
    switch (this.options.sidebartype) {
      case "full":
      case "iconbar":
        this.options.sidebartype = "mini-sidebar";
        break;

      case "overlay":
        this.showMobileMenu = !this.showMobileMenu;
        break;

      case "mini-sidebar":
        if (this.defaultSidebar === "mini-sidebar") {
          this.options.sidebartype = "full";
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  handleClick(event: boolean) {
    this.showMobileMenu = event;
  }
}
