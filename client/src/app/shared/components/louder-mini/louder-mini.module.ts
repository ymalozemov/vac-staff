import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LouderMiniComponent } from './louder-mini.component';
import { MaterialModule } from './material.module';



@NgModule({
  declarations: [LouderMiniComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    LouderMiniComponent
  ]
})
export class LouderMiniModule { }
