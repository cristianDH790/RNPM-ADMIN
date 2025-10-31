import { Route } from '@angular/router';
import { ProyectoListaComponent } from './lista/proyectoLista.component';
import { ProyectoEditarComponent } from './editar/proyectoEditar.component';

export default [
  {
    path: '',
    children: [
      {
        path: 'lista',
        component: ProyectoListaComponent,
        data: {
          title: 'Gestión de proyectos',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de proyectos' }
          ]
        }
      },
      {
        path: 'editar',
        component: ProyectoEditarComponent,
        data: {
          title: 'Nuevo proyecto',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de proyectos', url: '/proyectos/lista' },
            { title: 'Nuevo proyecto' }
          ]
        }
      },
      {
        path: 'editar/:id',
        component: ProyectoEditarComponent,
        data: {
          title: 'Edición de proyecto',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de proyectos', url: '/proyectos/lista' },
            { title: 'Edición de proyecto' }
          ]
        }
      }
    ]
  }
] as Route[];
