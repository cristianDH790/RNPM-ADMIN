import { Route } from '@angular/router';
import { FormacionListaComponent } from './lista/formacionLista.component';
import { FormacionEditarComponent } from './editar/formacionEditar.component';

export default [
  {
    path: '',
    children: [
      {
        path: 'lista',
        component: FormacionListaComponent,
        data: {
          title: 'Gestión de formacion',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de formaciones' }
          ]
        }
      },
      {
        path: 'editar',
        component: FormacionEditarComponent,
        data: {
          title: 'Nueva formacion',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de formaciones', url: '/formacion/lista' },
            { title: 'Nuevo formacion' }
          ]
        }
      },
      {
        path: 'editar/:id',
        component: FormacionEditarComponent,
        data: {
          title: 'Edición de formacion',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de formaciones', url: '/formacion/lista' },
            { title: 'Edición de formaciones' }
          ]
        }
      }
    ]
  }
] as Route[];
