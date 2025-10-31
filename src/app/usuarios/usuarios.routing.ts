import { Route, Routes } from '@angular/router';

import { UsuarioListaComponent } from './lista/usuarioLista.component';
import { UsuarioEditarComponent } from './editar/usuarioEditar.component';

export default [{
  path: '',
  children: [
    {
      path: 'lista',
      component: UsuarioListaComponent,
      data: {
        title: 'Gestión de usuarios',
        urls: [
          { title: 'Dashboard', url: '/dashboard/inicio' },
          { title: 'Gestión de usuarios' }
        ]
      }
    },
    {
      path: 'editar',
      component: UsuarioEditarComponent,
      data: {
        title: 'Nuevo usuario',
        urls: [
          { title: 'Dashboard', url: '/dashboard/inicio' },
          { title: 'Gestión de usuarios', url: '/usuarios/lista/' },
          { title: 'Nuevo usuario' }
        ]
      }
    },
    {
      path: 'editar/:id',
      component: UsuarioEditarComponent,
      data: {
        title: 'Edición de usuario',
        urls: [
          { title: 'Dashboard', url: '/dashboard/inicio' },
          { title: 'Gestión de usuarios', url: '/usuarios/lista' },
          { title: 'Edición de usuario' }
        ]
      }
    }


  ]
}
] as Route[];
