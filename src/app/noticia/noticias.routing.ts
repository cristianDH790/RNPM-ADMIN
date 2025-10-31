import { Route, Routes } from '@angular/router';

import { NoticiaListaComponent } from './lista/noticiaLista.component';

import { NoticiaEditarComponent } from './editar/noticiaEditar.component';

export default [{
  path: '',
  children: [
    {
      path: 'lista',
      component: NoticiaListaComponent,
      data: {
        title: 'Gestión de noticias',
        urls: [
          { title: 'Dashboard', url: '/dashboard/inicio' },
          { title: 'Gestión de noticias' }
        ]
      }
    },
    {
      path: 'editar',
      component: NoticiaEditarComponent,
      data: {
        title: 'Nueva noticia',
        urls: [
          { title: 'Dashboard', url: '/dashboard/inicio' },
          { title: 'Gestión de noticias', url: '/noticias/lista/' },
          { title: 'Nueva noticia' }
        ]
      }
    },
    {
      path: 'editar/:id',
      component: NoticiaEditarComponent,
      data: {
        title: 'Edición de noticia',
        urls: [
          { title: 'Dashboard', url: '/dashboard/inicio' },
          { title: 'Gestión de noticias', url: '/noticias/lista' },
          { title: 'Edición de noticias' }
        ]
      }
    }


  ]
}
] as Route[];
