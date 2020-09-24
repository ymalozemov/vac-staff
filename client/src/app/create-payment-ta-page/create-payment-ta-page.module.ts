import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MaterialModule } from './material.module'
import { CreatePaymentTaPageComponent } from './create-payment-ta-page.component'
import { ActivatedRouteSnapshot, RouterStateSnapshot, RouterModule } from '@angular/router'
import { NgxPermissionsGuard } from 'ngx-permissions'
import { LouderModule } from '../shared/components/louder/louder.module'
import { DirectiveModule } from '../shared/directives/directive.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CreateRefComponent } from './create-ref/create-ref.component'
import { LouderMiniModule } from '../shared/components/louder-mini/louder-mini.module'
import { ListOfServicesModule } from '../shared/components/list-of-services/list-of-services.module'


@NgModule({
  declarations: [CreatePaymentTaPageComponent, CreateRefComponent],
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
        component: CreatePaymentTaPageComponent
      }
    ]),
    MaterialModule,
    LouderModule,
    LouderMiniModule,
    ListOfServicesModule,
    DirectiveModule
  ]
})
export class CreatePaymentTaPageModule { }
