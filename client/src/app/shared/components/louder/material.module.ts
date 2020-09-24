import { NgModule } from '@angular/core'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
const MaterialComponent = [
  MatProgressSpinnerModule
]
@NgModule({
  imports: [MaterialComponent],
  exports: [MaterialComponent]
})
export class MaterialModule { }
