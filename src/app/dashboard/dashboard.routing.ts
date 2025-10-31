import { Route, Routes } from '@angular/router';
import { RealdataComponent } from './realdata/realdata.component';
import { SalesComponent } from './sales-summary/sales.component';

export default [
  {
    path: '',
    children: [
      {
        path: 'inicio',
        component: SalesComponent,
        data: {
          title: 'General Dashboard',
          urls: [
            { title: 'Inicio' }
          ]
        }
      },
    ]
  }
] as Route[];
