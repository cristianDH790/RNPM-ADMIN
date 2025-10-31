import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { authGuardGuard } from './auth-guard.guard';



export const routes: Routes = [

  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/authentication/login', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.routing')
      },
      {
        path: 'sliders',
        loadChildren: () => import('./sliders/sliders.routing')
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.routing')
      },
      {
        path: 'noticias',
        loadChildren: () => import('./noticia/noticias.routing')
      },
      {
        path: 'proyectos',
        loadChildren: () => import('./proyectos/proyectos.routing')
      },
      {
        path: 'formacion',
        loadChildren: () => import('./formacion/formacion.routing')
      },
      {
        path: 'suscripciones',
        loadChildren: () => import('./suscripciones/suscripciones.routing')
      },
      {
        path: 'alianzas',
        loadChildren: () => import('./alianza/alianza.routing')
      },
      {
        path: 'boletines',
        loadChildren: () => import('./boletin/boletin.routing')
      },

      {
        path: 'configuraciones',
        loadChildren: () => import('./configuraciones/configuraciones.routing')
      },
      {
        path: 'mensajes',
        loadChildren: () => import('./mensajes/mensajes.routing')
      },


      {
        path: 'contenido-web',
        loadChildren: () => import('./contenidosWeb/contenidosWeb.routing')
      },
      {
        path: 'contenido-web-categoria',
        loadChildren: () => import('./contenidoWebCategorias/contenidoWebCategorias.routing')
      },
  
    ],
    canActivate: [authGuardGuard] //Protejer las rutas
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () => import('./authentication/authentication.routing')

      }
    ]
  },
  {
    path: '**',
    redirectTo: '/authentication/404'
  }

];
