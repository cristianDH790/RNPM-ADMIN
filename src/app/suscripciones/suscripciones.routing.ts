import { Route } from '@angular/router';

import { SuscripcionListaComponent } from './lista/suscripcionLista.component';
import { SuscripcionEditarComponent } from './editar/suscripcionEditar.component';

 export default  [
  {
    path: '',
    children: [
      {
        path: 'lista',
        component: SuscripcionListaComponent,
        data: {
          title: 'Gestión de suscripciones',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de suscripciones' }
          ]
        }
      },
      {
        path: 'editar',
        component: SuscripcionEditarComponent,
        data: {
          title: 'Nueva suscripción',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de suscripciones', url: '/suscripciones/lista' },
            { title: 'Nueva suscripción' }
          ]
        }
      },
      {
        path: 'editar/:id',
        component: SuscripcionEditarComponent,
        data: {
          title: 'Edición de suscripción',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de suscripciones', url: '/suscripciones/lista' },
            { title: 'Edición de suscripción' }
          ]
        }
      }
    ]
  }
]as Route[];
