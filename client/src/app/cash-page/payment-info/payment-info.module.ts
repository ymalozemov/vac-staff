import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgxPermissionsGuard } from 'ngx-permissions'
import { ActivatedRouteSnapshot, RouterStateSnapshot, RouterModule } from '@angular/router'
import { PaymentInfoComponent } from './payment-info.component'
import { MaterialModule } from './material.module'
import { LouderModule } from 'src/app/shared/components/louder/louder.module'
import { PaymentInfoModalComponent } from './payment-info-modal/payment-info-modal.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'



@NgModule({
  declarations: [PaymentInfoComponent, PaymentInfoModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
        component: PaymentInfoComponent
      }
    ]),
    MaterialModule,
    LouderModule
  ]
})
export class PaymentInfoModule { }
