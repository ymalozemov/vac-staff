import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { TravelAgentService } from 'src/app/shared/services/travelAgent.service';
import { RefNumberService } from 'src/app/shared/services/refNumber.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted
    return !!(control && control.invalid && control.touched)
  }
}
@Component({
  selector: 'app-create-ref',
  templateUrl: './create-ref.component.html',
  styleUrls: ['./create-ref.component.css']
})
export class CreateRefComponent implements OnInit, OnDestroy {
  loading = false
  form: FormGroup
  date = new Date()
  refSub: Subscription
  refNumSub: Subscription
  travelAgents
  matcher = new MyErrorStateMatcher();
  constructor(public dialogRef: MatDialogRef<CreateRefComponent>, @Inject(MAT_DIALOG_DATA) public data, private TravelAgentService: TravelAgentService, private refNumberService: RefNumberService, private _snackBar: MatSnackBar) { }


  ngOnInit(): void {
    this.form = new FormGroup({
      nameTa: new FormControl(null, Validators.required),
      number: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
      count: new FormControl(null, Validators.required)
    })
    this.travelAgents = this.TravelAgentService.ta
  }
  ngOnDestroy() {
    if (this.refSub) {
      this.refSub.unsubscribe()
    }
  }
  onSubmit() {
    this.form.disable()
    this.refSub = this.refNumberService.create(this.form.value).subscribe(message => {
      this._snackBar.open(message.message, '', {
        duration: 3000
      })
      this.form.reset();
      this.form.enable();
    }, error => {
      this._snackBar.open(error.error.message, 'Закрыть', {
        duration: 3000
      })
      this.form.enable();
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
    if (this.refSub) {
      this.refSub.unsubscribe()
    }
  }
  input(event) {
    this.form.get(event.target.id).setValue(this.form.get(event.target.id).value.split(' ').join('').trim().replace(/[^0-9/\s]*/g, ''))
  }
}
