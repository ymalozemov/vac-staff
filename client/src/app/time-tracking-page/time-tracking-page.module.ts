import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MaterialModule } from './material.module'
import { TimeTrackingPageComponent } from './time-tracking-page.component'
import { LouderModule } from '../shared/components/louder/louder.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'



@NgModule({
  declarations: [TimeTrackingPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LouderModule,
    RouterModule.forChild([{
      path: '', component: TimeTrackingPageComponent
    }])
  ]
})
export class TimeTrackingPageModule { }
