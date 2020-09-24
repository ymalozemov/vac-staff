import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LoginPageComponent } from './login-page.component'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MaterialModule } from './material.module'




@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([{ path: '', component: LoginPageComponent }])
  ],
  exports: [RouterModule]
})
export class LoginPageModule { }
