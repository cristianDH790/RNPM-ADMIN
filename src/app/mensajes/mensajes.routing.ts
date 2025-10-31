import { Route, Routes } from '@angular/router';

import { MensajeListaComponent } from './lista/mensajeLista.component';
import { MensajeEditarComponent } from './editar/mensajeEditar.component';

export default [
  {
    path: '',
    children: [
      {
        path: 'lista',
        component: MensajeListaComponent,
        data: {
          title: 'Gestión de mensajes',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de mensajes' }
          ]
        }
      },
      {
        path: 'editar',
        component: MensajeEditarComponent,
        data: {
          title: 'Nuevo mensaje',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de mensajes', url: '/mensajes/lista' },
            { title: 'Nuevo mensaje' }
          ]
        }
      },
      {
        path: 'editar/:id',
        component: MensajeEditarComponent,
        data: {
          title: 'Edición de mensaje',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de mensajes', url: '/mensajes/lista' },
            { title: 'Edición de mensaje' }
          ]
        }
      }
    ]
  }
] as Route[];
