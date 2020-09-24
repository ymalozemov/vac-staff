import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';

const MaterialComponent = [
  MatListModule
]
@NgModule({
  imports: [MaterialComponent],
  exports: [MaterialComponent]
})
export class MaterialModule { }
