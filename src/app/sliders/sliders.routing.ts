import { Route } from '@angular/router';
import { SliderListaComponent } from './lista/sliderLista.component';
import { SliderEditarComponent } from './editar/sliderEditar.component';

export default [
  {
    path: '',
    children: [
      {
        path: 'lista',
        component: SliderListaComponent,
        data: {
          title: 'Gestión de sliders',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de sliders' }
          ]
        }
      },
      {
        path: 'editar',
        component: SliderEditarComponent,
        data: {
          title: 'Nuevo slider',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de sliders', url: '/sliders/lista' },
            { title: 'Nuevo slider' }
          ]
        }
      },
      {
        path: 'editar/:id',
        component: SliderEditarComponent,
        data: {
          title: 'Edición de slider',
          urls: [
            { title: 'Dashboard', url: '/dashboard/inicio' },
            { title: 'Gestión de sliders', url: '/sliders/lista' },
            { title: 'Edición de slider' }
          ]
        }
      }
    ]
  }
] as Route[];
