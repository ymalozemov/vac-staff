import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UpdateUserPageComponent } from './update-user-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LouderModule } from '../shared/components/louder/louder.module';
import { NgxPermissionsGuard } from 'ngx-permissions';



@NgModule({
  declarations: [UpdateUserPageComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LouderModule,
    RouterModule.forChild([{
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
      component: UpdateUserPageComponent
    }])
  ]
})
export class UpdateUserPageModule { }
