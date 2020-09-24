import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePaymentPageComponent } from './create-payment-page.component';
import { RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LouderModule } from '../shared/components/louder/louder.module';
import { DirectiveModule } from '../shared/directives/directive.module';
import { ListOfServicesModule } from '../shared/components/list-of-services/list-of-services.module';



@NgModule({
  declarations: [CreatePaymentPageComponent],
  imports: [
    CommonModule,
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
        component: CreatePaymentPageComponent
      }
    ]),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LouderModule,
    DirectiveModule,
    ListOfServicesModule
  ]
})
export class CreatePaymentPageModule { }
