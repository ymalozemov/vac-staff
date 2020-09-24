import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PricePageComponent } from './price-page.component'
import { RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { MaterialModule } from './material.module'
import { LouderModule } from '../shared/components/louder/louder.module'
import { NgxPermissionsGuard } from 'ngx-permissions'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'



@NgModule({
  declarations: [
    PricePageComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
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
      component: PricePageComponent
    }]),
    LouderModule
  ]
})
export class PricePageModule { }
