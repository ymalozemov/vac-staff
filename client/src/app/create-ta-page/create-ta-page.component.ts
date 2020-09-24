import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TravelAgentService } from '../shared/services/travelAgent.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-create-ta-page',
  templateUrl: './create-ta-page.component.html',
  styleUrls: ['./create-ta-page.component.css']
})
export class CreateTaPageComponent implements OnInit {
  form: FormGroup
  taSub: Subscription
  constructor(private travelAgentService: TravelAgentService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      tel: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
    })
  }
  onSubmit() {
    this.form.disable()

    this.taSub = this.travelAgentService.create(this.form.value).subscribe(message => {
      this._snackBar.open(message.message, '', {
        duration: 3000
      })
      this.form.reset()
      this.form.enable()
    }, error => {
      this._snackBar.open(error.error.message, 'Закрыть', {
        duration: 3000
      })
      this.form.enable()
    })
  }

}
