import { Route, Routes } from '@angular/router';
import { ContenidoWebCategoriaEditarComponent } from './editar/contenidoWebCategoriaEditar.component';

import { ContenidoWebCategoriaListaComponent } from './lista/contenidoWebCategoriaLista.component';

export default [
  {
    path: '',
    children: [
      {
        path: 'lista',
        component: ContenidoWebCategoriaListaComponent,
        data: {
          title: 'Gestión de categorías de contenidos web',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de categorías de contenidos web' }
          ]
        }
      },
      {
        path: 'editar',
        component: ContenidoWebCategoriaEditarComponent,
        data: {
          title: 'Nueva categoría de contenido web',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de categorías de contenidos web', url: '/contenido-web-categoria/lista' },
            { title: 'Nueva categoría de contenido web' }
          ]
        }
      },
      {
        path: 'editar/:id',
        component: ContenidoWebCategoriaEditarComponent,
        data: {
          title: 'Edición de categoría de contenido web',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de categorías de contenidos web', url: '/contenido-web-categoria/lista' },
            { title: 'Edición de categoría de contenido web' }
          ]
        }
      }
    ]
  }
] as Route[];
