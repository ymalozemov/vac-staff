import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar'


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted
    return !!(control && control.invalid && control.touched)
  }
}
@Component({
  selector: 'app-payment-info-modal',
  templateUrl: './payment-info-modal.component.html',
  styleUrls: ['./payment-info-modal.component.css']
})
export class PaymentInfoModalComponent implements OnInit, OnDestroy {
  loading = false
  form: FormGroup
  subMessage: Subscription
  matcher = new MyErrorStateMatcher();
  constructor(
    public dialogRef: MatDialogRef<PaymentInfoModalComponent>,
    private paymentService: PaymentService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.form = new FormGroup({
      message: new FormControl(null, Validators.required)
    })
  }
  onSubmit() {
    this.subMessage = this.paymentService.message(this.form.value, this.paymentService.payment._id)
      .subscribe(message => {
        this._snackBar.open(message.message, '', {
          duration: 3000
        })
      }, error => {
        this._snackBar.open(error.error.message, '', {
          duration: 3000
        })
      })
  }
  ngOnDestroy() {
    if (this.subMessage) {
      this.subMessage.unsubscribe()
    }
  }
  onNoClick() {
    this.dialogRef.close();
  }
}
