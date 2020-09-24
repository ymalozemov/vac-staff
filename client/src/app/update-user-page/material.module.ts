import { NgModule } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatRippleModule } from '@angular/material/core'

const MaterialComponent = [
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatRippleModule
]
@NgModule({
  imports: [MaterialComponent],
  exports: [MaterialComponent]
})
export class MaterialModule { }
