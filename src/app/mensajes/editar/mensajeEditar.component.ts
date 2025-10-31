import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { AuthService } from '../../core/service/auth.service';

import { URL_IMAGE } from '../../config/config';
import { Mensaje } from '../../core/model/mensaje';
import { Estado } from '../../core/model/estado';
import { Clase } from '../../core/model/clase';
import { Validacion } from '../../core/util/validacion';
import { AeButtonComponent, AngularEditorComponent, AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { ModalService } from '../../core/service/modal.service';
import { EstadoFiltro } from '../../core/filter/estadoFiltro';
import { ClaseFiltro } from '../../core/filter/claseFiltro';
import { FileManagerComponent } from '../../general/fileManager/fileManager.component';
import { CommonModule, NgClass } from '@angular/common';
import { NgxLoadingComponent, NgxLoadingModule } from 'ngx-loading';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ClaseService } from '../../core/service/clase.service';
import { EstadoService } from '../../core/service/estado.service';

import { MensajeService } from '../../core/service/mensaje.service';




@Component({
  selector: 'app-mensajeEditar',
  templateUrl: './mensajeEditar.component.html',
  providers: [EstadoService, MensajeService,ClaseService, AuthService],
  standalone:true,
  imports:[FontAwesomeModule,FileManagerComponent,RouterLink,CommonModule,FormsModule,AngularEditorModule,NgxLoadingModule]
})
export class MensajeEditarComponent {

  /*Font Awesome Iconos*/
  faCheck = faCheck;
  faArrowLeft = faArrowLeft;
  /*Fin Font awesome */

  urlImage=URL_IMAGE;

  mensaje: Mensaje = new Mensaje();
  estados!: Estado[];
  clases!: Clase[];

  titulo: string = "Nuevo mensaje";
  errores!: Validacion[];

  loading: boolean = true;
  lmensaje: boolean = false;
  lestados: boolean = false;
  lclases: boolean = false;


  //VARIABLES FILE MANAGER
  ventanaFileManager!: NgbModalRef;

  tipoFileManager:string="";
  imgSelected="";

  closeResult!: string;


    modalServiceNotificacion!: Subscription;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '100px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: 'p',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    //uploadUrl: 'v1/image',
    //upload: (file: File) => { ... }
    //uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [],
      ['insertImage',
     ],
    ]
  };
  constructor(
    private router: Router,

     private mensajeService: MensajeService,
    private claseService: ClaseService,
    private estadoService: EstadoService,
    private activatedRoute: ActivatedRoute,
    public ngbService: NgbModal,
    public modalService: ModalService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = + params.get('id')!;
      localStorage.setItem("rnpm.admin.carpeta", "mensaje");//nombre de la carpeta(cpanel/archivos)

      if (id) {
        this.mensajeService.getMensaje(id).subscribe((mensaje) => this.mensaje = mensaje);
        this.titulo = "Edición de mensaje";
      }
      this.lmensaje = true;
      this.actualizarCargador();
    });

    this.mensaje.nombre = "";
    this.mensaje.asunto = "";
    this.mensaje.contenido = "";
    this.mensaje.observacion = "";

    this.mensaje.estado = new Estado();
    this.mensaje.estado.idEstado = 387;
    this.mensaje.clase = new Clase();
    this.mensaje.clase.idClase = 201;


    this.estadoService.getEstados(new EstadoFiltro('', '', '', '', 315, 0, 0))
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.estados = response.content as Estado[];
        this.lestados = true;
        this.actualizarCargador();
      });

    this.claseService.getClases(new ClaseFiltro('', '', '', '', 0, 0, 0))
      .pipe(
        tap(response => { })
      ).subscribe(response => {
        this.clases = response.content as Clase[];
        this.lclases = true;
        this.actualizarCargador();
      });

      this.modalServiceNotificacion = this.modalService.notificarEvento.subscribe(modal => {
        console.log("RETORNO: "+modal.retorno);
        this.loading = true;
        let archivoSeleccionado: File = modal.archivo;
        let tipo= modal.retorno;
        if (modal.origen == "filemanager") {

          if(modal.retorno.imagen==true){
            switch (this.tipoFileManager){
              case 'contenido':
                this.imgSelected='<img alt="" style="width:'+modal.retorno.ancho+'px;height:'+modal.retorno.alto+'px"  src="'+this.urlImage+'/archivos/'+modal.retorno.url+'">';
                break;

            }

          }
          this.loading = false;
          this.ventanaFileManager.close();
        }


    });
  }

  ngOnDestroy() {
    this.modalServiceNotificacion.unsubscribe();
}
fileManager(content:any,tipoFileManager:string){
  console.log("iniciando filemanager");
  this.tipoFileManager=tipoFileManager;
  this.ventanaFileManager= this.ngbService.open(content, {ariaLabelledBy: 'modal-basic-title', windowClass: 'ventanaFileManager'});
  this.ventanaFileManager.result.then((e)=>{
    console.log("entro");
    this.closeResult = `Closed with: ${e}`;

  },(reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });

  console.log("Finalizando filemanager");
}




  guardar(): void {
    console.log("Guardar: " + this.mensaje.idMensaje);
    scroll(0,0);
    if (this.mensaje.idMensaje === undefined) {
      console.log("Nuevo");
      this.mensajeService.mensajeGuardar(this.mensaje)
        .subscribe(
          mensaje => {
            this.router.navigate(['/mensajes/lista']);
            Swal.fire('Nuevo mensaje', `El mensaje "${mensaje.nombre}" ha sido creado con éxito`, 'success');
          },
          err => {

            this.errores = err.error.errors as Validacion[];
            console.error('Código del error desde el backend: ' + err.status);
            console.error(err.error.errors);
          }
        );

    } else {
      console.log("Actualizar");
      this.mensajeService.mensajeActualizar(this.mensaje)
        .subscribe(
          mensaje => {
            this.router.navigate(['/mensajes/lista']);
            Swal.fire('Mensaje actualizado', `El mensaje "${mensaje.nombre}" ha sido actualizado con éxito`, 'success');
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
  compararClase(o1: Clase, o2: Clase): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idClase === o2.idClase;
  }

  compararEstado(o1: Estado, o2: Estado): boolean {
    if (o1 === undefined && o2 === undefined)
      return true;
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.idEstado === o2.idEstado;
  }


  actualizarCargador(){
    this.loading = (this.lestados && this.lclases && this.lmensaje ) ? false : true;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
    } else {
        return `with: ${reason}`;
    }
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
