import { Route, Routes } from '@angular/router';

import { ConfiguracionListaComponent } from './lista/configuracionLista.component';
import { ConfiguracionEditarComponent } from './editar/configuracionEditar.component';

export default [
  {
    path: '',
    children: [
      {
        path: 'lista',
        component: ConfiguracionListaComponent,
        data: {
          title: 'Configuración base',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Configuración base' }
          ]
        }
      },
      {
        path: 'editar',
        component: ConfiguracionEditarComponent,
        data: {
          title: 'Nueva configuración',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Configuración base', url: '/configuraciones/lista' },
            { title: 'Nueva configuración' }
          ]
        }
      },
      {
        path: 'editar/:id',
        component: ConfiguracionEditarComponent,
        data: {
          title: 'Edición de configuración',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Configuración base', url: '/configuraciones/lista' },
            { title: 'Edición de configuración' }
          ]
        }
      }
    ]
  }
] as Route[];
