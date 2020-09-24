import { NgModule } from '@angular/core'
import { MatSnackBarModule } from '@angular/material/snack-bar'

const MaterialComponent = [
  MatSnackBarModule
]
@NgModule({
  imports: [MaterialComponent],
  exports: [MaterialComponent]
})
export class MaterialModule { }
