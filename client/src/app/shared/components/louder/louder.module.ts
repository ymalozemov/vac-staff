import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LouderComponent } from './louder.component';
import { MaterialModule } from './material.module';



@NgModule({
  declarations: [LouderComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    LouderComponent
  ]
})
export class LouderModule { }
