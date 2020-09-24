import { NgModule } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
const MaterialComponent = [
  MatTableModule,
  MatInputModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatSelectModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule
]
@NgModule({
  imports: [MaterialComponent],
  exports: [MaterialComponent]
})
export class MaterialModule { }
