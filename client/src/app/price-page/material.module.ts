import { NgModule } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'


const MaterialComponent = [
  MatTableModule,
  MatSnackBarModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule
]
@NgModule({
  imports: [MaterialComponent],
  exports: [MaterialComponent]
})
export class MaterialModule { }
