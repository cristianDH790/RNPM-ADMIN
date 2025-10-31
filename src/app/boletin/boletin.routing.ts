import { Route, Routes } from '@angular/router';

import { BoletinListaComponent } from './lista/boletinLista.component';

import {  BoletinEditarComponent } from './editar/boletinEditar.component';

export default [{
  path: '',
  children: [
    {
      path: 'lista',
      component: BoletinListaComponent,
      data: {
        title: 'Gestión de boletines',
        urls: [
          { title: 'Dashboard', url: '/dashboard/inicio' },
          { title: 'Gestión de boletines' }
        ]
      }
    },
    {
      path: 'editar',
      component: BoletinEditarComponent,
      data: {
        title: 'Nueva boletin',
        urls: [
          { title: 'Dashboard', url: '/dashboard/inicio' },
          { title: 'Gestión de boletines', url: '/boletines/lista/' },
          { title: 'Nuevo boletin' }
        ]
      }
    },
    {
      path: 'editar/:id',
      component: BoletinEditarComponent,
      data: {
        title: 'Edición de boletin',
        urls: [
          { title: 'Dashboard', url: '/dashboard/inicio' },
          { title: 'Gestión de boletines', url: '/boletines/lista' },
          { title: 'Edición de boletin' }
        ]
      }
    }


  ]
}
] as Route[];
