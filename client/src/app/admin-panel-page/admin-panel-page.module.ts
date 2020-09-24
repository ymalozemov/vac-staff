import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminPanelPageComponent } from './admin-panel-page.component';
import { NgxPermissionsGuard } from 'ngx-permissions';



@NgModule({
  declarations: [AdminPanelPageComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([{
      path: '',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
            if (state.url.split('/').find(url => url == 'admin')) {
              return 'checkInAdmin'
            }
            if (state.url.split('/').find(url => url == 'main')) {
              return 'checkInUSer'
            }
          },
          redirectTo: {
            checkInUser: {
              navigationCommands: ['/main'],
              navigationExtras: {
                queryParams: {
                  permissionTimeTracking: true
                }
              }
            },
            checkInAdmin: {
              navigationCommands: ['/admin/time-tracking'],
              navigationExtras: {
                queryParams: {
                  permissionTimeTracking: true
                }
              }
            },
            default: '/login'

          }
        }
      },
      component: AdminPanelPageComponent
    }])
  ]
})
export class AdminPanelPageModule { }
