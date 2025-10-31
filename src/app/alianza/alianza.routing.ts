import { Route, Routes } from '@angular/router';

import { AlianzaListaComponent } from './lista/alianzaLista.component';

import { AlianzaEditarComponent } from './editar/alianzaEditar.component';

export default [{
  path: '',
  children: [
    {
      path: 'lista',
      component: AlianzaListaComponent,
      data: {
        title: 'Gestión de alianzas',
        urls: [
          { title: 'Dashboard', url: '/dashboard/inicio' },
          { title: 'Gestión de alianzas' }
        ]
      }
    },
    {
      path: 'editar',
      component: AlianzaEditarComponent,
      data: {
        title: 'Nueva alianza',
        urls: [
          { title: 'Dashboard', url: '/dashboard/inicio' },
          { title: 'Gestión de alianzas', url: '/alianza/lista/' },
          { title: 'Nueva alianza' }
        ]
      }
    },
    {
      path: 'editar/:id',
      component: AlianzaEditarComponent,
      data: {
        title: 'Edición de noticia',
        urls: [
          { title: 'Dashboard', url: '/dashboard/inicio' },
          { title: 'Gestión de alianzas', url: '/alianza/lista' },
          { title: 'Edición de alianza' }
        ]
      }
    }


  ]
}
] as Route[];
