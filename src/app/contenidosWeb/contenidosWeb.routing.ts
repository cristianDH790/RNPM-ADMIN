import { Route, Routes } from '@angular/router';

import { ContenidoWebListaComponent } from './lista/contenidoWebLista.component';
import { ContenidoWebEditarComponent } from './editar/contenidoWebEditar.component';

export default [
  {
    path: '',
    children: [
      {
        path: 'lista',
        component: ContenidoWebListaComponent,
        data: {
          title: 'Gestión de contenidos web',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de contenidos web' }
          ]
        }
      },
      {
        path: 'editar',
        component: ContenidoWebEditarComponent,
        data: {
          title: 'Nuevo contenido web',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de contenidos web', url: '/contenido-web/lista' },
            { title: 'Nuevo contenido web' }
          ]
        }
      },
      {
        path: 'editar/:id',
        component: ContenidoWebEditarComponent,
        data: {
          title: 'Edición de contenido web',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de contenidos web', url: '/contenido-web/lista' },
            { title: 'Edición de contenido web' }
          ]
        }
      }
    ]
  }
] as Route[];
