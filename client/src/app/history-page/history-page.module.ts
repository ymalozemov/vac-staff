import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { NgxPermissionsGuard } from 'ngx-permissions'
import { HistoryPageComponent } from './history-page.component'
import { MaterialModule } from './material.module'
import { LouderModule } from '../shared/components/louder/louder.module'



@NgModule({
  declarations: [HistoryPageComponent],
  imports: [
    CommonModule,
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
      component: HistoryPageComponent
    }]),
    MaterialModule,
    LouderModule
  ]

})
export class HistoryPageModule { }
