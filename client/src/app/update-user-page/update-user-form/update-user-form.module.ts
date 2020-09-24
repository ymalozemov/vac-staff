import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UpdateUserFormComponent } from './update-user-form.component';
import { NgxPermissionsGuard } from 'ngx-permissions';



@NgModule({
  declarations: [UpdateUserFormComponent],

  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: '',
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
              if (state.url.split('/').find(perm => perm == 'admin')) {
                return 'checkInAdmin'
              }
              if (state.url.split('/').find(perm => perm == 'main')) {
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
        component: UpdateUserFormComponent
      }
    ])
  ]
})
export class UpdateUserFormModule { }
