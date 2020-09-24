import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CashPageComponent } from './cash-page.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { LouderModule } from '../shared/components/louder/louder.module';
import { DirectiveModule } from '../shared/directives/directive.module';
import { LouderMiniModule } from '../shared/components/louder-mini/louder-mini.module';



@NgModule({
  declarations: [CashPageComponent],
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
        component: CashPageComponent
      }
    ]),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LouderModule,
    LouderMiniModule,
    DirectiveModule
  ]
})
export class CashPageModule { }
