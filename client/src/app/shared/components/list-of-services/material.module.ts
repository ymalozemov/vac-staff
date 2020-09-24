import { NgModule } from '@angular/core'
import { MatTableModule } from '@angular/material/table'

const MaterialComponent = [
  MatTableModule
]
@NgModule({
  imports: [MaterialComponent],
  exports: [MaterialComponent]
})
export class MaterialModule { }
