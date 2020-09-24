import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';
import { AuthGuard } from './shared/classes/auth.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';



const routes: Routes = [
  { path: '', loadChildren: () => import('./shared/layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule) },
  {
    path: 'main',
    canActivate: [AuthGuard],
    canLoad: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'USER',
        redirectTo: {
          navigationCommands: ['/login'],
          navigationExtras: {
            queryParams: {
              permissionDenied: true
            }
          }
        }
      }
    },
    loadChildren: () => import('./shared/layouts/site-layout/site-layout.module').then(m => m.SiteLayoutModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    canLoad: [NgxPermissionsGuard],
    data: {
      permissions: {
        olny: 'ADMIN',
        redirectTo: {
          navigationCommands: ['/login'],
          navigationExtras: {
            queryParams: {
              permissionDenied: true
            }
          }
        }
      }
    },
    loadChildren: () => import('./shared/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
