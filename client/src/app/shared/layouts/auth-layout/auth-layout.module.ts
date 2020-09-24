import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AuthLayoutComponent } from './auth-layout.component'
import { RouterModule, Routes } from '@angular/router'
import { MaterialModule } from './material.module'

const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', loadChildren: () => import('../../../login-page/login-page.module').then(m => m.LoginPageModule) }
    ]
  }
]

@NgModule({
  declarations: [AuthLayoutComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthLayoutModule { }
