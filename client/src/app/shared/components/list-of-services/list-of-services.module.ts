import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ListOfServicesComponent } from './list-of-services.component';



@NgModule({
  declarations: [ListOfServicesComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [ListOfServicesComponent]
})
export class ListOfServicesModule { }
