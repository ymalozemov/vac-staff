import { NgModule } from '@angular/core'
import { RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { CommonModule } from '@angular/common'
import { MaterialModule } from './material.module'
import { CreateUserPageComponent } from './create-user-page.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgxPermissionsGuard } from 'ngx-permissions'



@NgModule({
  declarations: [CreateUserPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
        component: CreateUserPageComponent
      }])
  ]
})
export class CreateUserPageModule { }
